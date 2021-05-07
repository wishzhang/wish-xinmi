import verifyCodeService = require("../src/service/verify-code-service");
import server = require("../src");
import request = require("supertest");
import testUtil = require("./test-util");
import mysql = require("../src/dao/mysql");

beforeAll(async () => {
    await testUtil.clearDBTestData();
})

afterAll(async () => {
    await testUtil.clearDBTestData();
})

describe("登录模块", () => {

    describe('邮箱验证码登录', () => {
        test("/login/loginByEmail", async (done) => {
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
                    done();
                });
        });
    })

    describe('找回密码', () => {
        test("/login/findPasswordByEmail", async (done) => {
            const emailCode = verifyCodeService.createEmailCode();
            await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode);

            request(server)
                .post("/login/findPasswordByEmail")
                .send({
                    emailAddress: testUtil.account1.email,
                    verifyCode: emailCode,
                    newPassword: testUtil.account1.password
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })

    describe('账号密码登录', () => {
        let user: any = null;
        beforeAll(async (done) => {
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
        })

        test("/login/loginByPassword", (done) => {
            request(server)
                .post("/login/loginByPassword")
                .send({
                    username: user.username,
                    password: user.password
                })
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.code).toBe(0);
                    done();
                });
        });
    })
})
;
