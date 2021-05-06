import verifyCodeService = require("../src/service/verify-code-service");
import userService = require("../src/service/user-service");
import server = require("../src");
import request = require("supertest");

beforeAll(() => {
    console.log('before all...');
});

afterAll(() => {
    console.log('after all...');
});

describe("登录模块", () => {
    const rightEmail = "1535703141@qq.com";
    const rightEmailPassword = "admin1";
    const errorEmail = "1535703141@1.";

    test("POST /login/loginByPassword", (done) => {
        request(server)
            .post("/login/loginByPassword")
            .send({
                username: "00000",
                password: "admin1"
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body.code).toBe(0);
                done();
            });
    });

    test("POST /login/loginByEmail", async (done) => {
        const emailCode = verifyCodeService.createEmailCode();
        await verifyCodeService.sendEmailCode(rightEmail, emailCode);

        request(server)
            .post("/login/loginByEmail")
            .send({
                emailAddress: rightEmail,
                verifyCode: emailCode
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body.code).toBe(0);
                done();
            });
    });

    test("POST /login/findPasswordByEmail", async (done) => {
        const emailCode = verifyCodeService.createEmailCode();
        await verifyCodeService.sendEmailCode(rightEmail, emailCode);

        request(server)
            .post("/login/findPasswordByEmail")
            .send({
                emailAddress: rightEmail,
                verifyCode: emailCode,
                newPassword: rightEmailPassword
            })
            .expect(200)
            .end(function (err, res) {
                expect(res.body.code).toBe(0);
                done();
            });
    });
});
