const mysql = require('./mysql');
const util = require('../util/index');
const contactDao = require('./contact-dao');
const userDao = require('./user-dao');
const chatDao = require('./chat-dao');
const uuid = util.uuid;
const DaoGenerator = require('./dao-generator');

const baseDao = DaoGenerator({
    tableName: 'xinmi_message',
    columns: [
        {name: 'message_id', type: DaoGenerator.columnGType.uuid},
        {name: 'origin_user'},
        {name: 'content'},
        {name: 'create_time', type: DaoGenerator.columnGType.datetime},
        {name: 'chat_id'},
    ]
})

/**
 * 获取小窗私聊对话列表
 * @param originUser
 * @param targetUser
 * @returns
 */
const getContactMessagePage = async ({originUser, targetUser, current, size}) => {
    const resData = await getMessagePage({originUser, targetUser, current, size})
    return resData
}

const getMessagePage = async ({originUser, targetUser, current, size}) => {
    const chatId = await chatDao.findChatId({originUser: originUser, targetUser: targetUser});

    const list = await getMessagePageByChatId({chatId, current, size});

    return list;
}

/*
 根据chatid查询聊天信息
*/
const getMessagePageByChatId = async ({chatId, current, size}) => {
    const resData = await baseDao.getPage({
        searchs: [
            {name: 'chat_id', value: chatId, signs: ['equal']},
            {name: 'create_time', signs: ['desc']}
        ],
        current: current,
        size: size
    })

    const records = [];
    for (let [k, v] of Object.entries(resData.records)) {
        let msg = await getMessageDetail(v);
        records.push(msg);
    }

    return resData;
}

// 获取一条消息的详情
const getMessageDetail = async (message) => {
    const originUserId = message.originUser;
    const chatId = message.chatId;
    const targetUserId = await findTargetUserId({chatId, originUser: originUserId});

    const originUser = await userDao.getUserDetail({userId: originUserId});
    message.originName = originUser.username;
    message.originAvatarUrl = originUser.avatarUrl;

    if (targetUserId) {
        const targetUser = await contactDao.getContactInfoHad({userId: originUserId, contactId: targetUserId});
        message.targetUser = targetUserId;
        message.targetAvatarUrl = targetUser.avatarUrl;
        message.targetName = targetUser.name;
    }

    return message;
}

/**
 * 获取我的消息列表
 * @param userId
 * @returns {Promise<any>}
 */
const getMineAllChatList = async ({userId}) => {
    let list = [];

    let myAllChatList = await chatDao.getList({
        searchs: [
            {name: 'user_id', value: userId, signs: ['equal']}
        ]
    });

    for (let chatItem of myAllChatList) {
        const obj = await getOneMessageChat({userId, chatId: chatItem.chatId});
        if (obj) {
            list.push(obj);
        }
    }

    return list;
}

const getOneMessageChat = async ({userId, chatId}) => {
    let obj = {};
    let messageMaxRow = await baseDao.getPage({
        searchs: [
            {name: 'chat_id', value: chatId, signs: ['equal']},
            {name: 'create_time', signs: ['desc']},
        ],
        current: 1,
        size: 1
    });
    if (messageMaxRow.records.length > 0) {
        const message = messageMaxRow.records[0];

        const contactId = await findTargetUserId({chatId: chatId, originUser: userId});
        const contactInfo = await contactDao.getContactInfoHad({userId: userId, contactId: contactId});
        const chatUnreadMessageCount = await getChatUnreadCount({chatId, contactId: contactId});

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
}

const findTargetUserId = async ({chatId, originUser}) => {
    const list = await mysql.query(`
      select * from xinmi_chat where chat_id='${chatId}' and user_id!='${originUser}'
    `);
    if (list.length > 0) {
        return list[0].userId;
    }
    return null;
}


/**
 * 添加一条消息: 如果没有对应的chatid就添加chat,有就更新
 * @param originUser
 * @param targetUser
 * @param content
 * @returns
 */
const addMessage = async ({originUser, targetUser, content}) => {
    let chatId = await chatDao.findChatId({originUser, targetUser});
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
              `
            },
            () => {
                return `
                insert into xinmi_message 
                (message_id, content, chat_id, create_time, origin_user) values 
                (uuid(), '${content}', '${chatId}', now(), '${originUser}')
                 `
            }
        ])
    }
}

// 获取所有用户发的消息
const getAllMessagePage = async ({current, size}) => {
    const resData = await mysql.queryPage(`
        SELECT
            *
        FROM
            xinmi_message xm
        ORDER BY
            xm.create_time DESC
    `, current, size);

    const records = resData.records;
    for (let i = 0; i < records.length; i++) {
        const el = records[i];
        const targetUserId = await findTargetUserId({chatId: el.chatId, originUser: el.originUser});
        let targetUser = await contactDao.getContactInfoHad({userId: el.originUser, contactId: targetUserId});
        el.targetId = targetUser.id;
        el.targetAvatarUrl = targetUser.avatarUrl;
        el.targetUsername = targetUser.username;

        const originUser = await contactDao.getContactInfoHad({userId: targetUserId, contactId: el.originUser});
        el.originUsername = originUser.username;
    }
    return resData;
}

const getChatUnreadCount = async ({chatId, contactId}) => {
    const count = await baseDao.getCount({
        searchs: [
            {name: 'chat_id', value: chatId, signs: ['equal']},
            {name: 'is_checked', value: 1, signs: ['and', 'unequal']},
            {name: 'origin_user', value: contactId, signs: ['and', 'equal']},

            {name: 'chat_id', value: chatId, signs: ['or', 'equal']},
            {name: 'is_checked', value: 1, signs: ['and', 'null']},
            {name: 'origin_user', value: contactId, signs: ['and', 'equal']},
        ]
    });
    return count;
}

const checkMessage = async ({userId, contactId}) => {
    const chatId = await chatDao.findChatId({originUser: userId, targetUser: contactId});
    if (chatId) {
        await baseDao.update({
            searchs: [
                {name: 'chat_id', value: chatId, signs: ['equal']},
                {name: 'origin_user', value: contactId, signs: ['and', 'equal']},
            ],
            set: {
                'is_checked': 1
            }
        })
    }
}

const delMessageByPeople = async ({userId, contactId}) => {
    const chatId = await chatDao.findChatId({originUser: userId, targetUser: contactId});
    await baseDao.del({
        searchs: [
            {name: 'chat_id', value: chatId, signs: ['equal']},
            {name: 'origin_user', value: userId, signs: ['and', 'equal']},

            {name: 'chat_id', value: chatId, signs: ['or', 'equal']},
            {name: 'origin_user', value: contactId, signs: ['and', 'equal']},
        ]
    })
}

module.exports = {
    addMessage,
    getContactMessagePage,
    getMineAllChatList,
    getMessagePageByChatId,
    getAllMessagePage,
    getChatUnreadCount,
    getOneMessageChat,
    checkMessage,
    delMessageByPeople
}

