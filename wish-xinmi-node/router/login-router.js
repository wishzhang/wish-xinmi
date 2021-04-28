const generator = require('../util/generator');

const loginService = require('../service/login-service');
const verifyCodeService = require('../service/verify-code-service');
const userService = require('../service/user-service');


const router = require('./router-factory')('/login');

router.post('/loginByPassword', async (ctx) => {
    const {username, password} = ctx.request.body;

    const user = await userService.getOneUser({username, password});
    if (user) {
        ctx.body = R.success(user);
    } else {
        ctx.body = R.fail(1, '用户名或密码错误');
    }
});

/**
 * 通过邮箱登录
 * @param emailAddress 邮箱地址
 * @param verifyCode 验证码
 * @return code: 1 没有对应的账号 2 验证码错误
 */
router.post('/loginByEmail', async (ctx) => {
    const {emailAddress, verifyCode} = ctx.request.body;

    // 验证码是否有效
    const isValidCode = verifyCodeService.checkCode(emailAddress, verifyCode);
    if (!isValidCode) {
        ctx.body = R.fail(2, '验证码错误');
        return;
    }

    // 邮箱地址是否已注册，没有注册就自动注册
    const user = await userService.getOneUser({emailAddress});
    if (!user) {
        const maxId = await userService.getMaxXinmiId();
        const xinmiId = generator.createXinmiId(maxId);
        const user = {
            username: xinmiId,
            password: '',
            emailAddress: emailAddress
        };
        await userService.insertUser(user);
    }
    ctx.body = R.success(user);
})

/**
 * 找回密码
 * @param emailAddress
 * @param verifyCode
 * @param newPassword
 * @return code: 1 该邮箱未注册 2 验证码错误
 */
router.post('/findPasswordByEmail', async (ctx) => {
    const {emailAddress, verifyCode, newPassword} = ctx.request.body;

    // 验证码是否有效
    const isValidCode = verifyCodeService.checkCode(emailAddress, verifyCode);
    if (!isValidCode) {
        ctx.body = R.fail(2, '验证码错误');
        return;
    }

    // 邮箱地址是否已注册
    const user = await userService.getOneUser({emailAddress});
    if (!user) {
        ctx.body = R.fail(1, '该邮箱未注册');
        return;
    }

    // 修改密码
    await userService.updatePasswordByEmailAddress(newPassword, emailAddress);
    ctx.body = R.success();
})

module.exports = router;