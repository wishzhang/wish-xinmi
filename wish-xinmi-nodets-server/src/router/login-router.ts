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

    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().custom((value) => {
            if (!validate.validPassword(value)) {
                throw new Error('密码格式错误');
            }
        })
    })
    try {
        await schema.validateAsync({username, password});
    } catch (e) {
        throw e.message;
    }

    const user = await userService.findOne({username, password});
    if (user) {
        ctx.body = R.success(user);
    } else {
        ctx.body = R.fail(1, "用户名或密码错误");
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

    const schema = Joi.object({
        emailAddress: Joi.string().email().required(),
        verifyCode: Joi.required()
    })

    try {
        await schema.validateAsync({emailAddress, verifyCode});
    } catch (err) {
        throw err.message;
    }

    // 验证码是否有效
    const isValidCode = verifyCodeService.canMatchEmailCode(emailAddress, verifyCode);
    if (!isValidCode) {
        ctx.body = R.fail(2, "验证码错误");
        return;
    }

    // 邮箱地址是否已注册，没有注册就自动注册
    let user: any = await userService.findEmailAddress(emailAddress);
    if (!user) {
        const maxId = await userService.getMaxXinmiId();
        const xinmiId = generator.createXinmiId(maxId);
        const obj = {
            username: xinmiId,
            emailAddress: emailAddress
        };
        user = await userService.insertUser(obj);
    }

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
    const schema = Joi.object({
        emailAddress: Joi.string().email().required(),
        verifyCode: Joi.string().required(),
        newPassword: Joi.string().custom((value) => {
            if (!validate.validPassword(value)) {
                throw new Error('密码格式错误');
            }
        })
    })
    try {
        await schema.validateAsync({emailAddress, verifyCode, newPassword});
    } catch (e) {
        throw e.message;
    }

    // 验证码是否有效
    const isValidCode = verifyCodeService.canMatchEmailCode(emailAddress, verifyCode);
    if (!isValidCode) {
        ctx.body = R.fail(2, "验证码错误");
        return;
    }

    // 邮箱地址是否已注册
    const user = await userService.findEmailAddress(emailAddress);
    if (!user) {
        ctx.body = R.fail(1, "该邮箱未注册");
        return;
    }

    // 修改密码
    await userService.updatePasswordByEmailAddress(newPassword, emailAddress);
    ctx.body = R.success();
});

export = router;