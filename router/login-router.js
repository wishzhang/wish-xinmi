const util = require('../util/index');
const successRes = util.successRes;
const loginService = require('../service/login-service');

const router = require('koa-router')({
  prefix: '/login'
});

router.get('/', async (ctx) => {
  const query = ctx.request.query;
  const obj = {
    username: query.username,
    password: query.password
  }
  const list = await loginService.login(obj);
  if (list.length > 0) {
    ctx.body = successRes({msg: '登录成功', data: list[0]});
  } else {
    ctx.body = successRes({code: 1, msg: '用户名或密码错误'});
  }
});

module.exports = router;