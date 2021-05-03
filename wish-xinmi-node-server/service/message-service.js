const messageDao = require('../dao/message-dao');
const chatDao = require('../dao/chat-dao');
const util = require('../util/index');
const datetime = require('../util/datetime');

const addMessage = async ({originUser, targetUser, content}) => {
    return await messageDao.addMessage({originUser, targetUser, content});
}

const getContactMessagePage = async ({originUser, targetUser, current, size}) => {
    return await messageDao.getContactMessagePage({originUser, targetUser, current, size});
}

const getMessagePageByChatId = async ({chatId, current, size}) => {
    return await messageDao.getMessagePageByChatId({chatId, current, size});
}

const getMineAllChatList = async ({userId}) => {
    const list = await messageDao.getMineAllChatList({userId});
    list.forEach(el => {
        el.createTime = datetime.dateFromNow(el.createTime);
    });
    return list;
}

const getAllMessagePage = async ({current, size}) => {
    const res = await messageDao.getAllMessagePage({current, size});
    return res;
}

const getChatAndUnreadCount = async ({originUser, targetUser}) => {
    let chatId = await chatDao.findChatId({originUser, targetUser});
    let count = await messageDao.getChatUnreadCount({chatId});
    return {
        originUser,
        targetUser,
        chatId,
        count
    }
}

const getOneMessageChat = async ({originUser, targetUser}) => {
    let chatId = await chatDao.findChatId({originUser, targetUser});
    let messageChat = await messageDao.getOneMessageChat({userId: targetUser, chatId});
    messageChat.createTime = datetime.dateFromNow(messageChat.createTime);
    return {
        originUser,
        targetUser,
        ...messageChat
    }
}

const checkMessage = async ({userId, contactId}) => {
    return await messageDao.checkMessage({userId, contactId});
}

module.exports = {
    addMessage,
    getContactMessagePage,
    getMineAllChatList,
    getAllMessagePage,
    getMessagePageByChatId,
    getChatAndUnreadCount,
    getOneMessageChat,
    checkMessage
}