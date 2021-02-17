const util = require('../util/index');
const successRes = util.successRes;
const messageService = require('../service/message-service');

const router = require('./router-factory')('/message');

router.get('/getContactMessageList', async (ctx) => {
  const query = ctx.query;
  const originUser = query.originUser;
  const targetUser = query.targetUser;
  const list = await messageService.getContactMessageList({originUser, targetUser});
  if (list.length > 0) {
    ctx.body = successRes({data: list});
  } else {
    ctx.body = successRes({code: 1, msg: '发送消息失败'});
  }
})

router.get('/getMineAllChatList', async (ctx) => {
  const query = ctx.query;
  const userId = query.id;
  const list = await messageService.getMineAllChatList({userId});
  if (list.length > 0) {
    ctx.body = successRes({data: list});
  } else {
    ctx.body = successRes({code: 1, msg: '获取我的消息列表失败'});
  }
})

router.get('/addMessage', async (ctx) => {
  const query = ctx.query;
  const originUser = query.originUser;
  const targetUser = query.targetUser;
  const content = query.content;
  const list = await messageService.addMessage({originUser, targetUser, content});
  try {
    ctx.body = successRes({data: list});
  } catch (e) {
    ctx.body = successRes({code: 1, msg: '发送消息失败'});
  }
})

module.exports = router;