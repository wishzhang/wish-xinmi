import userService from "../service/user-service";
import verifyCodeService from "../service/verify-code-service";
import R from "../util/response";
import {routerFactory} from "./router-factory";

const router = routerFactory("/user");

router.get("/page", async (ctx: any) => {
    const list = await userService.getUserList();
    ctx.body = R.success(list);
});

router.get("/update", async (ctx: any) => {
    const query = ctx.request.query;

    const obj = {
        username: query.username,
        password: query.password,
        avatarUrl: query.avatarUrl,
        bgUrl: query.bgUrl,
        userId: query.userId
    };
    await userService.updateUser(obj);
    ctx.body = R.success();
});

router.get("/detail", async (ctx: any) => {
    const query = ctx.request.query;
    const userId = query.userId;
    const detail = await userService.getOneUser(userId);
    ctx.body = R.success(detail);
});

/**
 * 修改邮箱
 * @param originEmailAddress
 * @param targetEmailAddress
 * @param verifyCode
 * @param password
 * @return code: 1 该邮箱未注册 2 验证码错误
 */
router.post("/editEmailAddress", async (ctx: any) => {
    const {originEmailAddress, targetEmailAddress, verifyCode, password} = ctx.request.body;

    // 验证码是否有效
    const isValidCode = verifyCodeService.canMatchEmailCode(targetEmailAddress, verifyCode);
    if (!isValidCode) {
        ctx.body = R.fail(2, "验证码错误");
        return;
    }

    // 密码是否有效
    const user = await userService.findOne({emailAddress: originEmailAddress, password: password});
    if (!user) {
        ctx.body = R.fail(1, "密码错误");
        return;
    }

    // 修改邮箱
    await userService.editEmailAddress(originEmailAddress, targetEmailAddress, password);
    ctx.body = R.success();
});

export default router;