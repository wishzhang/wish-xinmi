import R from "../util/response";
import loginService from "../service/login-service";
import verifyCodeService from "../service/verify-code-service";
import userService from "../service/user-service";
import {routerFactory} from "./router-factory";
import generator from '../util/generator';
import Joi from 'joi';
import validate from "../util/validate";

const router = routerFactory("/login");

router.post("/loginByPassword", async (ctx: any) => {
    const {username, password} = ctx.request.body;

    const user = await loginService.loginByPassword(username, password);
    if (user) {
        ctx.body = R.success(user);
    } else {
        throw Error('用户名或密码错误');
    }
});

/**
 * 通过邮箱登录
 * @param emailAddress 邮箱地址
 * @param verifyCode 验证码
 * @return code: 1 没有对应的账号 2 验证码错误
 */
router.post("/loginByEmail", async (ctx: any) => {
    const {emailAddress, verifyCode} = ctx.request.body;

    const user = await loginService.loginByEmail(emailAddress, verifyCode);

    ctx.body = R.success(user);
});

/**
 * 找回密码
 * @param emailAddress
 * @param verifyCode
 * @param newPassword
 * @return code: 1 该邮箱未注册 2 验证码错误
 */
router.post("/findPasswordByEmail", async (ctx: any) => {
    const {emailAddress, verifyCode, newPassword} = ctx.request.body;

    await userService.updatePasswordByEmailAddress(emailAddress, verifyCode, newPassword);

    ctx.body = R.success();
});

export = router;