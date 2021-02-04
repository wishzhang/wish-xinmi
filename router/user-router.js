const util = require('../util/index');
const userService = require('../service/user-service');

const gen = util.generateRouteKey('/user');
const successRes = util.successRes;

const userRouter = {
  [gen('/page')]: (async (ctx) => {
    const list = await userService.getUserList();
    ctx.body = list;
  }),
  [gen('/add')]: (async (ctx) => {
    const query = ctx.request.query;
    const username = query.username;
    const obj = {
      username: query.username,
      password: query.password,
    }
    const list = await userService.insertUser(obj);
    ctx.body = list;
  }),
  [gen('/detail')]: (async (ctx) => {
    const query = ctx.request.query;
    const userId = query.id;
    const detail = await userService.getUserDetail({userId});
    if (detail !== null) {
      ctx.body = successRes({data: detail});
    } else {
      ctx.body = successRes({code: 1, msg: '没有对应的用户数据', data: null});
    }
  })
}

module.exports = userRouter;