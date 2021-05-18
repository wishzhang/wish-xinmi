import util from "../util";
import chatDao from "./chat-dao";
import {Op, query, sequelize, queryPage} from "./sequelize";
import {Chat, ChatMember, Message} from "./model";
import contactDao from "./contact-dao";
import userDao from "./user-dao";


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
async function getMessagePageByChatId(chatId: string, current?: number, size?: number) {
    const resData = await queryPage(`
        select * from xinmi_message where chat_id='${chatId}' order by created_at desc
    `, current, size);

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

    const originUser: any = await userDao.getUserDetail(originUserId);
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
    let myAllChatList: any[];

    try {
        myAllChatList = await ChatMember.findAll({
            where: {userId: userId}
        })
    } catch (e) {
        console.log(e);
    }

    for (const chat of myAllChatList) {
        const tmp = await getOneMessageChat(userId, chat.chatId);
        list.push(tmp);
    }

    return list;
};

const getOneMessageChat = async (userId: string, chatId: string) => {
    let obj = {};
    let message: any;
    try {
        message = await Message.findOne({
            where: {
                chatId: chatId
            },
            order: [
                ['created_at', 'DESC']
            ]
        })
    } catch (e) {
        console.log(e);
    }


    if (message) {
        const contactId = await findTargetUserId(chatId, userId);
        const contactInfo: any = await contactDao.getContactInfoHad(userId, contactId);
        const chatUnreadMessageCount = await getChatUnreadCount(chatId, contactId);

        obj = {
            messageId: message.messageId,
            chatId: message.chatId,
            createdAt: message.createdAt,
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
    const row = await ChatMember.findOne({
        where: {
            chatId: chatId,
            userId: {
                [Op.ne]: originUser
            }
        }
    })
    return row && row.userId;
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
        const msg = await Message.create({
            content: content,
            chatId: chatId,
            originUser: originUser
        })
    } else {
        try {
            await sequelize.transaction(async (t: any) => {
                const chatId = uuid();
                const chat = await Chat.create({chatId: chatId},
                    {transaction: t});

                await ChatMember.bulkCreate([
                    {chatId: chatId, userId: originUser},
                    {chatId: chatId, userId: targetUser}
                ], {transaction: t})

                const msg = await Message.create({
                    chatId: chatId,
                    content: content,
                    originUser: originUser
                }, {transaction: t});
            })
        } catch (e) {
            console.log(e);
        }
    }
};

async function getChatUnreadCount(chatId: string, contactId: string) {
    const count1 = await Message.count({
        where: {
            [Op.and]: [
                {chatId: chatId},
                {originUser: contactId},
            ],
            isChecked: {
                [Op.ne]: 1
            }
        }
    });
    const count2 = await Message.count({
        where: {
            [Op.and]: [
                {chatId: chatId},
                {originUser: contactId},
            ],
            isChecked: {
                [Op.not]: null
            }
        }
    });
    const count = count1 + count2;

    return count;
};

const checkMessage = async (userId: string, contactId: string) => {
    const chatId = await chatDao.findChatId(userId, contactId);
    await Message.update({
        isChecked: 1
    }, {
        where: {
            [Op.and]: [
                {chatId: chatId},
                {originUser: contactId},
            ]
        }
    })
};

const delMessageByPeople = async (userId: string, contactId: string, options?: any) => {
    const chatId = await chatDao.findChatId(userId, contactId);
    await query(`
        delete from xinmi_message xm where chat_id='${chatId}' and origin_user='${userId}'
        or chat_id='${chatId}' and origin_user='${contactId}'
    `, options)
};

export default {
    addMessage,
    getContactMessagePage,
    getMineAllChatList,
    getMessagePageByChatId,
    getChatUnreadCount,
    getOneMessageChat,
    checkMessage,
    delMessageByPeople,
}

