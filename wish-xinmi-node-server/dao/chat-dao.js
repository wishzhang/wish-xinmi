const mysql = require('./mysql');
const DaoGenerator = require('./dao-generator');


const baseDao = DaoGenerator({
    tableName: 'xinmi_chat',
    columns: [
        {name: 'chat_id', type: DaoGenerator.columnGType.uuid},
        {name: 'user_id'},
        {name: 'create_time', type: DaoGenerator.columnGType.datetime},
    ]
})

const findChatId = async ({originUser, targetUser}) => {
    const chatList = await baseDao.getList({
        searchs: [
            {name: 'user_id', value: originUser, signs: ['equal']}
        ]
    });
    for (let chat of chatList) {
        const chatId = chat.chatId;
        const one = await baseDao.getOne({
            searchs: [
                {name: 'chat_id', value: chatId, signs: ['equal']},
                {name: 'user_id', value: targetUser, signs: ['and', 'equal']}
            ]
        });
        if (one) {
            return chatId;
        }
    }
    return null;
};

const delChat = async ({originUser, targetUser}) => {
    const chatId = await findChatId({originUser, targetUser});

    if (chatId) {
        const list = await baseDao.del({
            searchs: [
                {name: 'chat_id', value: chatId, signs: ['equal']}
            ]
        })
        return list;
    }

    return null;
};

module.exports = {
    ...baseDao,
    delChat,
    findChatId
}