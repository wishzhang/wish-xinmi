const util = require('../util/index');
const successRes = util.successRes;
const circleService = require('../service/circle-service');

const router = require('./router-factory')('/circle');

router.get('/getMineAllList', async (ctx) => {
  const query = ctx.query;
  const userId = query.id;
  const list = await circleService.getMineAllList({userId});
  if (list.length > 0) {
    ctx.body = successRes({data: list});
  } else {
    ctx.body = successRes({code: 1, msg: '获取我的朋友圈列表失败'});
  }
});

router.get('/getPeopleList', async (ctx) => {
  const query = ctx.query;
  const userId = query.id;
  const list = await circleService.getPeopleList({userId});
  if (list.length > 0) {
    ctx.body = successRes({data: list});
  } else {
    ctx.body = successRes({code: 1, msg: '获取朋友圈列表失败'});
  }
});

router.get('/addThought', async (ctx) => {
  const query = ctx.query;
  const createUser = query.createUser;
  const content = query.content;
  try {
    await circleService.addThought({createUser, content});
    ctx.body = successRes({data: {}});
  } catch (e) {
    ctx.body = successRes({code: 1, msg: '添加失败'});
  }
})

module.exports = router;