import {User} from "../dao/model";
import Joi from "joi";
import validate from "../util/validate";
import userService from "./user-service";
import verifyCodeService from "./verify-code-service";
import R from "../util/response";
import generator from "../util/generator";

async function loginByPassword(username: string, password: string) {
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
    return user;
}

async function loginByEmail(emailAddress: string, verifyCode: string) {
    const schema = Joi.object({
        emailAddress: Joi.string().email().required(),
        verifyCode: Joi.required()
    })

    try {
        await schema.validateAsync({emailAddress, verifyCode});
    } catch (e) {
        throw e.message;
    }

    // 验证码是否有效
    const isValidCode = verifyCodeService.canMatchEmailCode(emailAddress, verifyCode);
    if (!isValidCode) {
        return Error('验证码错误')
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

    return user;
}

export default {
    loginByPassword,
    loginByEmail
}