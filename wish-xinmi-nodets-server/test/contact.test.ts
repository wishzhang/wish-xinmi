import verifyCodeService = require("../src/service/verify-code-service");
import userService = require("../src/service/user-service");
import server = require("../src");
import request = require("supertest");
import testUtil = require("./test-util");
import circleDao = require("../src/dao/chat-dao");
import contactDao = require("../src/dao/contact-dao");
import contactRecordDao = require("../src/dao/contact-record-dao");
import messageDao = require("../src/dao/message-dao");
import userDao = require("../src/dao/user-dao");
import mysql = require("../src/dao/mysql");

let userId1 = '';
let userId2 = '';

// 初始化两个独立用户
const beforeInit = async (done: any) => {
    await testUtil.clearDBTestData();

    const emailCode1 = verifyCodeService.createEmailCode();
    await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode1);
    request(server)
        .post("/login/loginByEmail")
        .send({
            emailAddress: testUtil.account1.email,
            verifyCode: emailCode1
        })
        .expect(200)
        .end(async function (err, res) {
            expect(res.body.code).toBe(0);
            userId1 = res.body.data.id;

            const emailCode2 = verifyCodeService.createEmailCode();
            await verifyCodeService.sendEmailCode(testUtil.account2.email, emailCode2);
            request(server)
                .post("/login/loginByEmail")
                .send({
                    emailAddress: testUtil.account2.email,
                    verifyCode: emailCode2
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    userId2 = res.body.data.id;
                    done();
                });
        });
}

beforeAll(async (done) => {
    await beforeInit(done);
}, 20 * 1000);

afterAll(async () => {
    await testUtil.clearDBTestData();
});

describe("联系人模块", () => {

    describe('获取可添加的联系人', () => {
        test("/contact/getNoContactList", async (done) => {
            request(server)
                .get("/contact/getNoContactList")
                .query({
                    id: userId1
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('发送联系人验证请求', () => {
        test("/contact/addContact", async (done) => {
            request(server)
                .get("/contact/addContact")
                .query({
                    id: userId1,
                    contactId: userId2,
                    validateMsg: 'who am i'
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('获取待确认的联系人列表', () => {
        test("/contact/getConfirmContactList", async (done) => {
            request(server)
                .get("/contact/getConfirmContactList")
                .query({
                    id: userId1
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('获取未读的待确认的联系人提醒数量', () => {
        test("/contact/getContactWarnNum", async (done) => {
            request(server)
                .get("/contact/getContactWarnNum")
                .query({
                    userId: userId2
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('读取联系人待确认提醒信息', () => {
        test("/contact/setAllContactChecked", async (done) => {
            request(server)
                .post("/contact/setAllContactChecked")
                .send({
                    userId: userId1
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('确认联系人', () => {
        test("/contact/confirmContact", async (done) => {
            request(server)
                .get("/contact/confirmContact")
                .query({
                    id: userId2,
                    contactId: userId1
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('获取已添加的联系人', () => {
        test("/contact/getYesContactList", async (done) => {
            request(server)
                .get("/contact/getYesContactList")
                .query({
                    id: userId1
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('获取用户和联系人的握手状态', () => {
        test("/contact/getUserContactStatus", async (done) => {
            request(server)
                .get("/contact/getUserContactStatus")
                .query({
                    id: userId1,
                    contactId: userId2
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('获取联系人详情', () => {
        test("/contact/getContactInfoHad", async (done) => {
            request(server)
                .get("/contact/getContactInfoHad")
                .query({
                    userId: userId1,
                    contactId: userId2
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('编辑联系人的备注名', () => {
        test("/contact/editContact", async (done) => {
            request(server)
                .post("/contact/editContact")
                .send({
                    userId: userId1,
                    contactId: userId2,
                    contactName: 'hihi'
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('删除联系人', () => {
        test("/contact/deleteContact", async (done) => {
            request(server)
                .post("/contact/deleteContact")
                .send({
                    userId: userId1,
                    contactId: userId2,
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })
});
