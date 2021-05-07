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

describe("验证码模块", () => {
    describe('发送验证吗', () => {
        test("/verifyCode/sendEmailCode", async (done) => {
            const emailCode = verifyCodeService.createEmailCode();
            await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode);

            request(server)
                .post("/verifyCode/sendEmailCode")
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
})
