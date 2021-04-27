const verifyCodeService = require('../service/verify-code-service');

const router = require('./router-factory')('/verifyCode');

/**
 * 发送邮件验证码
 * @param address 对方邮箱
 */
router.get('/sendEmail', async (ctx) => {
    const query = ctx.query;
    const addr = query.address;
    const res = await verifyCodeService.sendEmail(addr);
    if (res.code === 0) {
        ctx.body = R.success();
    } else if (res.code === 1) {
        ctx.body = R.fail(1, '邮箱格式错误！');
    }
});

router.get('/find', async (ctx) => {
    const query = ctx.query;
    const addr = query.addr;
    const code = query.code;
    if (verifyCodeService.validAddrAndCode(addr, code)) {

    } else {
        ctx.body = R.fail(1, '验证码错误！');
    }
})

module.exports = router;