const util = require('../util/index');
const loginService = require('../service/login-service');
const iconv = require('iconv-lite');

const gen = util.generateRouteKey('/login');
const successRes = util.successRes;

module.exports = {
  [gen('')]: (async (ctx) => {
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
  })
};