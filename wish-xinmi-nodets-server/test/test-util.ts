import chatDao = require("../src/dao/chat-dao");
import circleDao = require("../src/dao/chat-dao");
import contactDao = require("../src/dao/contact-dao");
import contactRecordDao = require("../src/dao/contact-record-dao");
import messageDao = require("../src/dao/message-dao");
import userDao = require("../src/dao/user-dao");
import mysql = require("../src/dao/mysql");

// 单元测试应该保持简单高效，直接操作测试数据库全部数据。
// 测试每个模块前清库。然后重新建立数据进行测试。每个模块有before,after钩子的过程处理
// 每个模块内部的功能点为一个describe,尽量减少功能点的测试依赖，可以在describe里的before,after在处理私有的一些数据处理

const account1 = {
    email: "2683536959@qq.com",
    password: "admin1"
}

const account2 = {
    email: "458799767@qq.com",
    password: "admin1"
}

const accountError = {
    email: '1535703141@1.',
    password: 'wwwwww'
}

const delAllUser = async (userId1: string, userId2: string) => {
    await circleDao.del({
        wheres: [
            {name: 'user_id', value: userId1, signs: ['equal']},
            {name: 'user_id', value: userId2, signs: ['or', 'equal']},
        ]
    });
    await messageDao.del({
        wheres: [
            {name: 'origin_user', value: userId1, signs: ['equal']},
            {name: 'origin_user', value: userId2, signs: ['or', 'equal']},
        ]
    });
    await chatDao.del({
        wheres: [
            {name: 'user_id', value: userId1, signs: ['equal']},
            {name: 'user_id', value: userId2, signs: ['or', 'equal']},
        ]
    });
    await contactDao.del({
        wheres: [
            {name: 'user_id', value: userId1, signs: ['equal']},
            {name: 'contact_id', value: userId2, signs: ['and', 'equal']},

            {name: 'user_id', value: userId2, signs: ['or', 'equal']},
            {name: 'contact_id', value: userId1, signs: ['and', 'equal']},
        ]
    });
    await contactRecordDao.del({
        wheres: [
            {name: 'user_id', value: userId1, signs: ['equal']},
            {name: 'contact_id', value: userId2, signs: ['and', 'equal']},

            {name: 'user_id', value: userId2, signs: ['or', 'equal']},
            {name: 'contact_id', value: userId1, signs: ['and', 'equal']},
        ]
    });
    await userDao.del({
        wheres: [
            {name: 'id', value: userId1, signs: ['equal']},
            {name: 'id', value: userId2, signs: ['or', 'equal']},
        ]
    });
}

const delOneUser = async (userId: string) => {
    await circleDao.del({
        wheres: [
            {name: 'user_id', value: userId, signs: ['equal']},
        ]
    });
    await messageDao.del({
        wheres: [
            {name: 'origin_user', value: userId, signs: ['equal']},
        ]
    });
    await chatDao.del({
        wheres: [
            {name: 'user_id', value: userId, signs: ['equal']},
        ]
    });
    await userDao.del({
        wheres: [
            {name: 'id', value: userId, signs: ['equal']},
        ]
    });
}

const clearDBTestData = async () => {
    const user1 = await userDao.findOne({emailAddress: account1.email});
    const user2 = await userDao.findOne({emailAddress: account2.email});

    if ((user1 && user2)) {
        await delAllUser(user1.id, user2.id);
    } else {
        if (user1) {
            await delOneUser(user1.id);
        }
        if (user2) {
            await delOneUser(user2.id);
        }
    }
}

export = {
    account1,
    account2,
    accountError,
    clearDBTestData
}