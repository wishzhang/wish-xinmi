import messageDao from "../dao/message-dao";
import chatDao from "../dao/chat-dao";
import util from "../util";
import datetime from '../util/datetime';

const addMessage = async (originUser: string, targetUser: string, content: string) => {
    return await messageDao.addMessage(originUser, targetUser, content);
};

const getContactMessagePage = async (obj: any) => {
    return await messageDao.getContactMessagePage(obj.originUser, obj.targetUser, obj.current, obj.size);
};

const getMessagePageByChatId = async (obj: any) => {
    return await messageDao.getMessagePageByChatId(obj.chatId, obj.current, obj.size);
};

const getMineAllChatList = async (userId: string) => {
    const list = await messageDao.getMineAllChatList(userId);
    list.forEach((el: any) => {
        el.createdAt = datetime.dateFromNow(el.createdAt);
    });
    return list;
};

const getChatAndUnreadCount = async (originUser: any, targetUser: any) => {
    const chatId = await chatDao.findChatId(originUser, targetUser);
    const count = await messageDao.getChatUnreadCount(chatId, targetUser);
    return {
        originUser,
        targetUser,
        chatId,
        count
    };
};

const getOneMessageChat = async (originUser: string, targetUser: string) => {
    const chatId = await chatDao.findChatId(originUser, targetUser);
    const messageChat: any = await messageDao.getOneMessageChat(targetUser, chatId);
    messageChat.createdAt = datetime.dateFromNow(messageChat.createdAt);
    return {
        originUser,
        targetUser,
        ...messageChat
    };
};

const checkMessage = async (userId: any, contactId: any) => {
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