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

let user1: any;
let user2: any;

beforeAll(async (done) => {
    await testUtil.clearDBTestData();
    // 两个用户注册了
    const emailCode1 = verifyCodeService.createEmailCode();
    await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode1);

    return new Promise((resolve: any) => {
        request(server)
            .post("/login/loginByEmail")
            .send({
                emailAddress: testUtil.account1.email,
                verifyCode: emailCode1
            })
            .expect(200)
            .end(async function (err, res) {
                expect(res.body.code).toBe(0);
                user1 = res.body.data;

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
                        user2 = res.body.data;
                        // 这两个用户成为联系人，，，接着调用下面的消息模块接口
                        request(server)
                            .get("/contact/addContact")
                            .query({
                                id: user1.id,
                                contactId: user2.id,
                                validateMsg: 'who am i'
                            })
                            .expect(200)
                            .end(function (err, res) {
                                expect(res.body.code).toBe(0);
                                request(server)
                                    .get("/contact/confirmContact")
                                    .query({
                                        id: user2.id,
                                        contactId: user1.id
                                    })
                                    .expect(200)
                                    .end(function (err, res) {
                                        expect(res.body.code).toBe(0);
                                        resolve();
                                        done();
                                    });
                            });
                    });
            });
    })

})

afterAll(async () => {
    await testUtil.clearDBTestData();
})

describe("朋友圈", () => {
    describe('获取我的公共朋友圈', () => {
        test("/circle/getPage", async (done) => {
            request(server)
                .get("/circle/getPage")
                .query({
                    userId: user1.id,
                    current: 1,
                    size: 10
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('获取某人的朋友圈', () => {
        test("/circle/getUserThoughtPage", async (done) => {
            request(server)
                .get("/circle/getUserThoughtPage")
                .query({
                    userId: user1.id
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('发一条朋友圈', () => {
        test("/circle/addThought", (done) => {
            request(server)
                .post("/message/addMessage")
                .send({
                    originUser: user1.id,
                    targetUser: user2.id,
                    content: '圈圈内容' + Date.now()
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })
});

