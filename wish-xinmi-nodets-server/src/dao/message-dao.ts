import mysql = require("./mysql");
import util = require("../util");
import contactDao = require("./contact-dao");
import userDao = require("./user-dao");
import chatDao = require("./chat-dao");
import Daogenerator = require("./dao-generator");

const baseDao = Daogenerator({
    tableName: "xinmi_message",
    columns: [
        {name: "message_id", type: Daogenerator.columnGType.uuid},
        {name: "origin_user", type: Daogenerator.columnGType.string},
        {name: "content", type: Daogenerator.columnGType.string},
        {name: "create_time", type: Daogenerator.columnGType.datetime},
        {name: "chat_id", type: Daogenerator.columnGType.string},
    ]
});

const uuid = util.uuid;

/**
 * 获取小窗私聊对话列表
 * @param originUser
 * @param targetUser
 * @returns
 */
const getContactMessagePage = async (originUser: string, targetUser: string, current?: number, size?: number) => {
    const resData = await getMessagePage(originUser, targetUser, current, size);
    return resData;
};

const getMessagePage = async (originUser: string, targetUser: string, current?: number, size?: number) => {
    const chatId = await chatDao.findChatId(originUser, targetUser);

    const list = await getMessagePageByChatId(chatId, current, size);

    return list;
};

/*
 根据chatid查询聊天信息
*/
const getMessagePageByChatId = async (chatId: string, current?: number, size?: number) => {
    const resData = await baseDao.getPage({
        wheres: [
            {name: "chat_id", value: chatId, signs: ["equal"]},
            {name: "create_time", signs: ["desc"]}
        ],
        current: current,
        size: size
    });

    const records = [];
    for (const [k, v] of Object.entries(resData.records)) {
        const msg = await getMessageDetail(v);
        records.push(msg);
    }

    return resData;
};

// 获取一条消息的详情
const getMessageDetail = async (message: any) => {
    const originUserId = message.originUser;
    const chatId = message.chatId;
    const targetUserId = await findTargetUserId(chatId, originUserId);

    const originUser = await userDao.getUserDetail(originUserId);
    message.originName = originUser.username;
    message.originAvatarUrl = originUser.avatarUrl;

    if (targetUserId) {
        const targetUser = await contactDao.getContactInfoHad(originUserId, targetUserId);
        message.targetUser = targetUserId;
        message.targetAvatarUrl = targetUser.avatarUrl;
        message.targetName = targetUser.name;
    }

    return message;
};

/**
 * 获取我的消息列表
 * @param userId
 * @returns {Promise<any>}
 */
const getMineAllChatList = async (userId: string) => {
    const list = [];

    const myAllChatList: any = await chatDao.getList({
        wheres: [
            {name: "user_id", value: userId, signs: ["equal"]}
        ]
    });

    for (const chat of myAllChatList) {
        const tmp = await getOneMessageChat(userId, chat.chatId);
        list.push(tmp);
    }

    return list;
};

const getOneMessageChat = async (userId: string, chatId: string) => {
    let obj = {};
    const messageMaxRow: any = await baseDao.getPage({
        wheres: [
            {name: "chat_id", value: chatId, signs: ["equal"]},
            {name: "create_time", signs: ["desc"]},
        ],
        current: 1,
        size: 1
    });
    if (messageMaxRow.records.length > 0) {
        const message = messageMaxRow.records[0];

        const contactId = await findTargetUserId(chatId, userId);
        const contactInfo = await contactDao.getContactInfoHad(userId, contactId);
        const chatUnreadMessageCount = await getChatUnreadCount(chatId, contactId);

        obj = {
            messageId: message.messageId,
            chatId: message.chatId,
            createTime: message.createTime,
            avatarUrl: contactInfo.avatarUrl,
            name: contactInfo.name,
            content: message.content,
            contactId: contactId,
            unreadCount: chatUnreadMessageCount
        };

        return obj;
    }
    return null;
};

const findTargetUserId = async (chatId: string, originUser: string) => {
    const list: any = await mysql.query(`
      select * from xinmi_chat where chat_id='${chatId}' and user_id!='${originUser}'
    `);
    if (list.length > 0) {
        return list[0].userId;
    }
    return null;
};


/**
 * 添加一条消息: 如果没有对应的chatid就添加chat,有就更新
 * @param originUser
 * @param targetUser
 * @param content
 * @returns
 */
const addMessage = async (originUser: string, targetUser: string, content: string) => {
    let chatId = await chatDao.findChatId(originUser, targetUser);
    if (chatId) {
        return await mysql.query(`
        insert into xinmi_message (message_id, content, chat_id, create_time, origin_user) values 
        (uuid(), '${content}', '${chatId}', now(), '${originUser}')
      `);
    } else {
        chatId = uuid();
        return await mysql.transaction([
            () => {
                return `
                insert into xinmi_chat (chat_id, user_id, create_time) values 
                ('${chatId}', '${originUser}', now()),
                ('${chatId}', '${targetUser}', now())
              `;
            },
            () => {
                return `
                insert into xinmi_message 
                (message_id, content, chat_id, create_time, origin_user) values 
                (uuid(), '${content}', '${chatId}', now(), '${originUser}')
                 `;
            }
        ]);
    }
};

const getChatUnreadCount = async (chatId: string, contactId: string) => {
    const count = await baseDao.getCount({
        wheres: [
            {name: "chat_id", value: chatId, signs: ["equal"]},
            {name: "is_checked", value: 1, signs: ["and", "unequal"]},
            {name: "origin_user", value: contactId, signs: ["and", "equal"]},

            {name: "chat_id", value: chatId, signs: ["or", "equal"]},
            {name: "is_checked", value: 1, signs: ["and", "null"]},
            {name: "origin_user", value: contactId, signs: ["and", "equal"]},
        ]
    });
    return count;
};

const checkMessage = async (userId: string, contactId: string) => {
    const chatId = await chatDao.findChatId(userId, contactId);
    if (chatId) {
        await baseDao.update({
            wheres: [
                {name: "chat_id", value: chatId, signs: ["equal"]},
                {name: "origin_user", value: contactId, signs: ["and", "equal"]},
            ],
            set: {
                "is_checked": 1
            }
        });
    }
};

const delMessageByPeople = async (userId: string, contactId: string) => {
    const chatId = await chatDao.findChatId(userId, contactId);
    await baseDao.del({
        wheres: [
            {name: "chat_id", value: chatId, signs: ["equal"]},
            {name: "origin_user", value: userId, signs: ["and", "equal"]},

            {name: "chat_id", value: chatId, signs: ["or", "equal"]},
            {name: "origin_user", value: contactId, signs: ["and", "equal"]},
        ]
    });
};

export = {
    addMessage,
    getContactMessagePage,
    getMineAllChatList,
    getMessagePageByChatId,
    getChatUnreadCount,
    getOneMessageChat,
    checkMessage,
    delMessageByPeople,
    ...baseDao
}

