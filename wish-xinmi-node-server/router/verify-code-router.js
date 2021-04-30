const verifyCodeService = require('../service/verify-code-service');

const router = require('./router-factory')('/verifyCode');

/**
 * 发送邮件验证码
 * @param address 对方邮箱
 */
router.post('/sendEmail', async (ctx) => {
    const {emailAddress} = ctx.request.body;

    const res = await verifyCodeService.sendEmail(emailAddress);
    if (res.code === 0) {
        ctx.body = R.success();
    } else if (res.code === 1) {
        ctx.body = R.fail(1, '邮箱格式错误！');
    }
});

module.exports = router;