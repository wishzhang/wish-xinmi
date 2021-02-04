const util = require('../util/index');
const successRes = util.successRes;
const circleService = require('../service/circle-service');

const gen = util.generateRouteKey('/circle');

module.exports = {
  [gen('/getMineAllList')]: (async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await circleService.getMineAllList({userId});
    if (list.length > 0) {
      ctx.body = successRes({data: list});
    } else {
      ctx.body = successRes({code: 1, msg: '获取我的朋友圈列表失败'});
    }
  }),
  [gen('/getPeopleList')]: (async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await circleService.getPeopleList({userId});
    if (list.length > 0) {
      ctx.body = successRes({data: list});
    } else {
      ctx.body = successRes({code: 1, msg: '获取朋友圈列表失败'});
    }
  }),
  [gen('/addThought')]: (async (ctx) => {
    const query = ctx.query;
    const createUser = query.createUser;
    const content = query.content;
    try {
      await circleService.addThought({createUser, content});
      ctx.body = successRes({data: {}});
    } catch (e) {
      ctx.body = successRes({code: 1, msg: '添加失败'});
    }
  }),
};