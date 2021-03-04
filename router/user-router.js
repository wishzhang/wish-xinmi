const userService = require('../service/user-service');

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
        id: query.id
    }
    await userService.updateUser(obj);
    ctx.body = R.success();
})

router.get('/detail', async (ctx) => {
    const query = ctx.request.query;
    const userId = query.id;
    const detail = await userService.getUserDetail({userId});
    ctx.body = R.success(detail);
})

module.exports = router;