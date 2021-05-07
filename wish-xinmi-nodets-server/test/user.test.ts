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


let user: any = null;

beforeAll(async (done) => {
    await testUtil.clearDBTestData();

    const emailCode = verifyCodeService.createEmailCode();
    await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode);
    request(server)
        .post("/login/loginByEmail")
        .send({
            emailAddress: testUtil.account1.email,
            verifyCode: emailCode
        })
        .expect(200)
        .end(function (err, res) {
            expect(res.body.code).toBe(0);
            user = res.body.data;
            done();
        });
},10* 1000)

afterAll(async () => {
    await testUtil.clearDBTestData();
})

describe("用户模块", () => {

    describe('获取用户分页列表', () => {
        test("/user/page", async (done) => {
            request(server)
                .get("/user/page")
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('更新用户信息', () => {
        test("/user/update", async (done) => {
            request(server)
                .get("/user/update")
                .query({
                    id: user.id,
                    username: user.username,
                    password: testUtil.account1.password
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('获取用户详情', () => {
        test("/user/detail", async (done) => {
            request(server)
                .get("/user/detail")
                .query({
                    id: user.id
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('修改email', () => {
        test("/user/editEmailAddress", async (done) => {
            const emailCode = verifyCodeService.createEmailCode();
            await verifyCodeService.sendEmailCode(testUtil.account2.email, emailCode);

            request(server)
                .post("/user/editEmailAddress")
                .send({
                    originEmailAddress: testUtil.account1.email,
                    targetEmailAddress: testUtil.account2.email,
                    password: testUtil.account1.password,
                    verifyCode: emailCode
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

});
