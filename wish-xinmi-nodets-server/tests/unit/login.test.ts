
import verifyCodeService = require('../../src/service/verify-code-service');

beforeAll(() => {
});

describe('登录模块', () => {

    describe('发送验证码', () => {

        test('向通过校验的邮箱发送验证码', async () => {
            let res:any = await verifyCodeService.sendEmailCode('1535703141@qq.com');
            expect(res.code).toBe(0);
        });

        test('向没有通过校验的邮箱发送验证码', async () => {
            let res:any = await verifyCodeService.sendEmailCode('1535703141@1.');
            expect(res.code).toBe(1);
        });

        test('向通过校验但无效的邮箱发送验证码', async () => {
            let res:any = await verifyCodeService.sendEmailCode('abc@qq.com');
            expect(res.code).toBe(2);
        });

        test('验证码为刚好6位数字字符串', () => {
            let code = verifyCodeService.createEmailCode();
            expect(code).toMatch(/^\d{6}$/);
        })
    });
});
