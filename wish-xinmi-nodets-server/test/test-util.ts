import {query} from "../src/dao/sequelize";

const request = require("supertest");
import {QueryTypes} from '../src/dao/sequelize';
import {registerTwoUser} from "./common.test";


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
    await query(`delete from xinmi_thought`, {type: QueryTypes.DELETE});
    await query(`delete from xinmi_message`, {type: QueryTypes.DELETE});
    await query(`delete from xinmi_chat_member`, {type: QueryTypes.DELETE});
    await query(`delete from xinmi_chat`, {type: QueryTypes.DELETE});
    await query(`delete from xinmi_contact`, {type: QueryTypes.DELETE});
    await query(`delete from xinmi_contact_record`, {type: QueryTypes.DELETE});
    await query(`delete from xinmi_user`, {type: QueryTypes.DELETE});
}

const prepareTest = async () => {
    await clearDBTestData();
    const res = await registerTwoUser();
    return res;
}

const afterTest = async () => {
    await clearDBTestData();
}

export default {
    account1,
    account2,
    accountError,
    clearDBTestData,
    prepareTest,
    afterTest
}