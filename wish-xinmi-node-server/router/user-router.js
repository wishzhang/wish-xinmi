const userService = require('../service/user-service');
const verifyCodeService = require('../service/verify-code-service');

const router = require('./router-factory')('/user');

router.get('/page', async (ctx) => {
    const list = await userService.getUserList();
    ctx.body = R.success(list);
})

router.get('/add', async (ctx) => {
    const query = ctx.request.query;
    const username = query.username;
    const obj = {
        username: query.username,
        password: query.password,
    }
    await userService.insertUser(obj);
    ctx.body = R.success();
})

router.get('/update', async (ctx) => {
    const query = ctx.request.query;

    const obj = {
        username: query.username,
        password: query.password,
        avatarUrl: query.avatarUrl,
        bgUrl: query.bgUrl,
        id: query.id
    }
    await userService.updateUser(obj);
    ctx.body = R.success();
})

router.get('/detail', async (ctx) => {
    const query = ctx.request.query;
    const userId = query.id;
    const detail = await userService.getOneUser({userId});
    ctx.body = R.success(detail);
})


/**
 * 修改邮箱
 * @param originEmailAddress
 * @param targetEmailAddress
 * @param verifyCode
 * @param password
 * @return code: 1 该邮箱未注册 2 验证码错误
 */
router.post('/editEmailAddress', async (ctx) => {
    const {originEmailAddress, targetEmailAddress, verifyCode, password} = ctx.request.body;

    // 验证码是否有效
    const isValidCode = verifyCodeService.checkCode(targetEmailAddress, verifyCode);
    if (!isValidCode) {
        ctx.body = R.fail(2, '验证码错误');
        return;
    }

    // 密码是否有效
    const user = await userService.getOneUser({emailAddress: originEmailAddress, password: password});
    if (!user) {
        ctx.body = R.fail(1, '密码错误');
        return;
    }

    // 修改邮箱
    await userService.editEmailAddress({originEmailAddress, targetEmailAddress, password});
    ctx.body = R.success();
})

module.exports = router;