import messageDao = require('../dao/message-dao');
import chatDao = require('../dao/chat-dao');
import util = require('../util');
import datetime = require('../util/datetime');

const addMessage = async (originUser: string, targetUser: string, content: string) => {
    return await messageDao.addMessage(originUser, targetUser, content);
}

const getContactMessagePage = async (obj: any) => {
    return await messageDao.getContactMessagePage(obj.originUser, obj.targetUser, obj.current, obj.size);
}

const getMessagePageByChatId = async (obj: any) => {
    return await messageDao.getMessagePageByChatId(obj.chatId, obj.current, obj.size);
}

const getMineAllChatList = async (userId: string) => {
    const list = await messageDao.getMineAllChatList(userId);
    list.forEach((el: any) => {
        el.createTime = datetime.dateFromNow(el.createTime);
    });
    return list;
}

const getChatAndUnreadCount = async (originUser: any, targetUser: any) => {
    let chatId = await chatDao.findChatId(originUser, targetUser);
    let count = await messageDao.getChatUnreadCount(chatId, targetUser);
    return {
        originUser,
        targetUser,
        chatId,
        count
    }
}

const getOneMessageChat = async (originUser: any, targetUser: any) => {
    let chatId = await chatDao.findChatId(originUser, targetUser);
    let messageChat:any = await messageDao.getOneMessageChat(targetUser, chatId);
    messageChat.createTime = datetime.dateFromNow(messageChat.createTime);
    return {
        originUser,
        targetUser,
        ...messageChat
    }
}

const checkMessage = async (userId: any, contactId: any) => {
    return await messageDao.checkMessage(userId, contactId);
}

export = {
    addMessage,
    getContactMessagePage,
    getMineAllChatList,
    getMessagePageByChatId,
    getChatAndUnreadCount,
    getOneMessageChat,
    checkMessage
}