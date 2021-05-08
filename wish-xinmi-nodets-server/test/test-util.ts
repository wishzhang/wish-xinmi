import chatDao = require("../src/dao/chat-dao");
import circleDao = require("../src/dao/circle-dao");
import contactDao = require("../src/dao/contact-dao");
import contactRecordDao = require("../src/dao/contact-record-dao");
import messageDao = require("../src/dao/message-dao");
import userDao = require("../src/dao/user-dao");
import verifyCodeService = require("../src/service/verify-code-service");
import mysql = require("../src/dao/mysql");
import request = require("supertest");
import server = require("../src/server");


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

const clearDBTestData = async () => {
    await circleDao.del({wheres: []});
    await messageDao.del({wheres: []});
    await chatDao.del({wheres: []});
    await contactDao.del({wheres: []});
    await contactRecordDao.del({wheres: []});
    await userDao.del({wheres: []});
}

const prepareTest = async () => {
    await clearDBTestData();
    const res = await require("./login.test").registerTwoUser();
    return {
        user1: res.user1,
        user2: res.user2
    }
}

const afterTest = async () => {
    await clearDBTestData();
}

export = {
    account1,
    account2,
    accountError,
    clearDBTestData,
    prepareTest,
    afterTest
}