import mysql = require("./mysql");

import Daogenerator = require("./dao-generator");

const baseDao = Daogenerator({
    tableName: "xinmi_chat",
    columns: [
        {name: "chat_id", type: Daogenerator.columnGType.uuid},
        {name: "user_id", type: Daogenerator.columnGType.string},
        {name: "create_time", type: Daogenerator.columnGType.datetime}
    ]
});

const findChatId = async (originUser:string, targetUser: string) => {
    const chatList:any = await baseDao.getList({
        wheres: [
            {name: "user_id", value: originUser, signs: ["equal"]}
        ]
    });
    for (const chat of chatList) {
        const chatId = chat.chatId;
        const one = await baseDao.getOne({
            wheres: [
                {name: "chat_id", value: chatId, signs: ["equal"]},
                {name: "user_id", value: targetUser, signs: ["and", "equal"]}
            ]
        });
        if (one) {
            return chatId;
        }
    }
    return null;
};

const delChat = async (originUser: string, targetUser: string) => {
    const chatId = await findChatId(originUser, targetUser);

    if (chatId) {
        const list = await baseDao.del({
            wheres: [
                {name: "chat_id", value: chatId, signs: ["equal"]}
            ]
        });
        return list;
    }

    return null;
};

export = {
    ...baseDao,
    delChat,
    findChatId
}