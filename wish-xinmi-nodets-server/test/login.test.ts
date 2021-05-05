import verifyCodeService = require("../src/service/verify-code-service");
import userService = require("../src/service/user-service");
import server = require("../src");
import request = require("supertest");

describe("登录模块", () => {

    const rightEmail = "1535703141@qq.com";
    const errorEmail = "1535703141@1.";

    test("POST /login/loginByPassword", (done) => {
        return request(server)
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

    //
    // test('判断邮箱是否注册', async () => {
    //     let user = await userService.findEmailAddress(rightEmail);
    //     expect(user).not.toBeNull();
    //
    //     user = userService.findEmailAddress(errorEmail);
    //     expect(user).toBeNull();
    // })

    // describe('发送验证码', () => {
    //
    //     test('向通过校验的邮箱发送验证码', async () => {
    //         let res = await verifyCodeService.sendEmailCode(rightEmail);
    //         expect(res.code).toBe(0);
    //     });
    //
    //     test('向没有通过校验的邮箱发送验证码', async () => {
    //         let res = await verifyCodeService.sendEmailCode(errorEmail);
    //         expect(res.code).toBe(1);
    //     });
    //
    //     test('向通过校验但无效的邮箱发送验证码', async () => {
    //         let res = await verifyCodeService.sendEmailCode('abc@qq.com');
    //         expect(res.code).toBe(2);
    //     });
    //
    //     test('验证码为刚好6位数字字符串', () => {
    //         let code = verifyCodeService.createEmailCode();
    //         expect(code).toMatch(/^\d{6}$/);
    //     })
    // });

    // describe('邮箱验证码注册', async () => {
    //     test('已注册的邮箱和验证码注册', async () => {
    //         let code = verifyCodeService.createEmailCode();
    //         let res = await verifyCodeService.sendEmailCode(rightEmail, code);
    //         expect(res.code).toBe(0);
    //     })
    // })
});
