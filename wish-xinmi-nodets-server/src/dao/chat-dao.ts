import {Chat} from "./model";
import {ChatMember} from "./model";
import {query} from "./sequelize";

async function findChatId(user1: string, user2: string) {
    const chat: any = await query(
        `SELECT xcm1.chat_id
                FROM
                xinmi_chat_member AS xcm1
                INNER JOIN xinmi_chat_member AS xcm2 ON xcm1.chat_id = xcm2.chat_id
                WHERE
                xcm1.user_id = '${user1}' AND
                xcm2.user_id = '${user2}' OR
                xcm1.user_id = '${user2}' AND
                xcm2.user_id = '${user1}'
                GROUP BY
                xcm1.chat_id
            `
    )
    return chat && chat.chatId;
}

async function delChat(user1: string, user2: string, options={}) {
    await Chat.destroy({
        where: {
            user1: user1,
            user2: user2
        },
        ...options
    })
}

export default {
    findChatId,
    delChat
}