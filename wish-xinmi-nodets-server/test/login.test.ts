import verifyCodeService = require("../src/service/verify-code-service");
import server = require("../src/server");
import request = require("supertest");
import testUtil = require("./test-util");
import mysql = require("../src/dao/mysql");

beforeAll(async () => {
    await testUtil.clearDBTestData();
})

afterAll(async () => {
    await testUtil.afterTest();
})

// 注册两个用户
const registerTwoUser = async () => {
    let user1: any;
    let user2: any;
    let emailCode1: string;
    let emailCode2: string;
    let res1: any;
    let res2: any;

    emailCode1 = verifyCodeService.createEmailCode();
    await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode1, false);
    res1 = await request(server)
        .post("/login/loginByEmail")
        .send({
            emailAddress: testUtil.account1.email,
            verifyCode: emailCode1
        });

    expect(res1.body.code).toBe(0);
    user1 = res1.body.data;

    emailCode2 = verifyCodeService.createEmailCode();
    await verifyCodeService.sendEmailCode(testUtil.account2.email, emailCode2, false);
    res2 = await request(server)
        .post("/login/loginByEmail")
        .send({
            emailAddress: testUtil.account2.email,
            verifyCode: emailCode2
        });
    expect(res2.body.code).toBe(0);
    user2 = res2.body.data;

    return {
        user1,
        user2
    }
}

describe("登录模块", () => {

    describe('邮箱验证码登录', () => {
        test("/login/loginByEmail", async (done) => {
            const emailCode = verifyCodeService.createEmailCode();
            await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode, false);

            const res = await request(server)
                .post("/login/loginByEmail")
                .send({
                    emailAddress: testUtil.account1.email,
                    verifyCode: emailCode
                })
            expect(res.body.code).toBe(0);
            done();
        });
    })

    describe('找回密码', () => {
        test("/login/findPasswordByEmail", async (done) => {
            const emailCode = verifyCodeService.createEmailCode();
            await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode, false);

            const res = await request(server)
                .post("/login/findPasswordByEmail")
                .send({
                    emailAddress: testUtil.account1.email,
                    verifyCode: emailCode,
                    newPassword: testUtil.account1.password
                })
            expect(res.body.code).toBe(0);
            done();
        });
    })

    describe('账号密码登录', () => {
        let user: any = null;
        beforeAll(async (done) => {
            const emailCode = verifyCodeService.createEmailCode();
            await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode, false);

            const res = await request(server)
                .post("/login/loginByEmail")
                .send({
                    emailAddress: testUtil.account1.email,
                    verifyCode: emailCode
                })
            expect(res.body.code).toBe(0);
            user = res.body.data;
            done();
        })

        test("/login/loginByPassword", async (done) => {
            const res = await request(server)
                .post("/login/loginByPassword")
                .send({
                    username: user.username,
                    password: user.password
                })
            expect(res.body.code).toBe(0);
            done();
        });
    })

    describe('注册', () => {
        beforeAll(async (done) => {
            testUtil.clearDBTestData();
            done()
        })
        test('注册成功的两个用户名字应该不同', async (done) => {
            const r = await registerTwoUser();
            const user1:any = r.user1;
            const user2:any = r.user2;
            expect(user1.username).not.toBe(user2.username);
            done();
        })
    })
})

export = {
    registerTwoUser
}
