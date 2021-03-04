const util = require('../util/index');
const userService = require('../service/user-service');

const successRes = util.successRes;

const router = require('./router-factory')('/user');

router.get('/page', async (ctx) => {
    const list = await userService.getUserList();
    ctx.body = successRes({data: list});
})

router.get('/add', async (ctx) => {
    const query = ctx.request.query;
    const username = query.username;
    const obj = {
        username: query.username,
        password: query.password,
    }
    const list = await userService.insertUser(obj);
    ctx.body = list;
})

router.get('/update', async (ctx) => {
    try {
        const query = ctx.request.query;

        const obj = {
            username: query.username,
            password: query.password,
            avatarUrl: query.avatarUrl,
            id: query.id
        }
        await userService.updateUser(obj);
        ctx.body = successRes({});
    } catch (e) {
        ctx.body = successRes({code: 1, msg: '修改用户数据失败', data: null});
    }
})

router.get('/detail', async (ctx) => {
    const query = ctx.request.query;
    const userId = query.id;
    const detail = await userService.getUserDetail({userId});
    if (detail !== null) {
        ctx.body = successRes({data: detail});
    } else {
        ctx.body = successRes({code: 1, msg: '没有对应的用户数据', data: null});
    }
})

module.exports = router;