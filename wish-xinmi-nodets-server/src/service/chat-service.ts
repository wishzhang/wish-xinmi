import {Chat, ChatMember} from "../dao/model";
import chatDao from '../dao/chat-dao';
import {sequelize} from "../dao/sequelize";

async function delChat(user1: string, user2: string) {
    const chatId = await chatDao.findChatId(user1, user2);

    if (chatId === null) {
        throw Error('delChat方法的chatId不能为null');
    }

    await sequelize.transaction(async (t: any) => {
        await ChatMember.destroy({
            where: {
                chatId: chatId
            },
            transaction: t
        })
        await Chat.destroy({
            where: {
                chatId: chatId
            },
            transaction: t
        })
    })
}

export default {
    delChat
}