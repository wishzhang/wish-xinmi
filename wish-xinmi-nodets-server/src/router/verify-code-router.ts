import verifyCodeService from "../service/verify-code-service";
import R from "../util/response";
import {routerFactory} from "./router-factory";

const router = routerFactory("/verifyCode");

/**
 * 发送邮件验证码
 * @param address 对方邮箱
 */
router.post("/sendEmailCode", async (ctx: any) => {
    const {emailAddress} = ctx.request.body;

    const emailCode = verifyCodeService.createEmailCode();
    const res: any = await verifyCodeService.sendEmailCode(emailAddress, emailCode);
    if (res.code === 0) {
        ctx.body = R.success();
    } else if (res.code === 1) {
        ctx.body = R.fail(1, "邮箱格式错误！");
    }
});

export default router;