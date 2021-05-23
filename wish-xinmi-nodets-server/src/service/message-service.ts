import messageDao from "../dao/message-dao";
import chatDao from "../dao/chat-dao";
import util from "../util";
import datetime from '../util/datetime';

async function addMessage(originUser: string, targetUser: string, content: string) {
    return await messageDao.addMessage(originUser, targetUser, content);
};

async function getContactMessagePage(obj: any) {
    return await messageDao.getContactMessagePage(obj.originUser, obj.targetUser, obj.current, obj.size);
};

async function getMessagePageByChatId(obj: any) {
    return await messageDao.getMessagePageByChatId(obj.chatId, obj.current, obj.size);
};

async function getMineAllChatList(userId: string) {
    const list = await messageDao.getMineAllChatList(userId);
    list.forEach((el: any) => {
        el.createdAt = datetime.dateFromNow(el.createdAt);
    });
    return list;
};

async function getChatAndUnreadCount(originUser: string, targetUser: string) {
    const chatId = await chatDao.findChatId(originUser, targetUser);
    const count = await messageDao.getChatUnreadCount(chatId, targetUser);
    return {
        originUser,
        targetUser,
        chatId,
        count
    };
};

async function getOneMessageChat(originUser: string, targetUser: string) {
    const chatId = await chatDao.findChatId(originUser, targetUser);
    const messageChat: any = await messageDao.getOneMessageChat(targetUser, chatId);
    messageChat.createdAt = datetime.dateFromNow(messageChat.createdAt);
    return {
        originUser,
        targetUser,
        ...messageChat
    };
};

async function checkMessage(userId: string, contactId: string) {
    return await messageDao.checkMessage(userId, contactId);
};

export default {
    addMessage,
    getContactMessagePage,
    getMineAllChatList,
    getMessagePageByChatId,
    getChatAndUnreadCount,
    getOneMessageChat,
    checkMessage
}