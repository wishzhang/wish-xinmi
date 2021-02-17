const util = require('../util/index');
const contactService = require('../service/contact-service');

const successRes = util.successRes;

const router = require('./router-factory')('/contact');

router.get('/getYesContactList', async (ctx) => {
  const query = ctx.query;
  const userId = query.id;
  const list = await contactService.getYesContactList({userId});
  ctx.body = successRes({data: list});
})

router.get('/addContact', async (ctx) => {
  const query = ctx.request.query;
  const userId = query.id;
  const contactId = query.contactId;
  const validateMsg = query.validateMsg;
  try {
    await contactService.addContact({userId, contactId, validateMsg});
    ctx.body = successRes({});
  } catch (e) {
    ctx.body = successRes({code: 1, msg: '失败'});
  }
})

router.get('/getNoContactList', async (ctx) => {
  const query = ctx.query;
  const userId = query.id;
  const username = query.username || '';
  const list = await contactService.getNoContactList({userId, username});
  ctx.body = successRes({data: list});
})

router.get('/getConfirmContactList', async (ctx) => {
  const query = ctx.query;
  const userId = query.id;
  const list = await contactService.getConfirmContactList({userId});
  ctx.body = successRes({data: list});
})

router.get('/confirmContact', async (ctx) => {
  const query = ctx.query;
  const userId = query.id;
  const contactId = query.contactId;
  try {
    await contactService.confirmContact({userId, contactId});
    ctx.body = successRes({});
  } catch (e) {
    ctx.body = successRes({code: 1, msg: '确认失败'});
  }
});

router.get('/getUserContactStatus', async (ctx) => {
  const query = ctx.query;
  const userId = query.id;
  const contactId = query.contactId;
  const list = await contactService.getUserContactStatus({userId, contactId});
  if (list.length === 1) {
    ctx.body = successRes({msg: '当前用户对应的这个联系人状态', data: list[0].status});
  } else {
    ctx.body = successRes({code: 1, msg: '获取用户当前联系人的状态失败了'});
  }
});

router.get('/getContactDetail', async (ctx) => {
  const query = ctx.query;
  const userId = query.userId;
  const contactId = query.contactId;
  const list = await contactService.getContactDetail({userId, contactId});
  console.log(list);
  if (list.length > 0) {
    ctx.body = successRes({data: list[0]});
  } else {
    ctx.body = successRes({code: 1, msg: '获取联系人详情失败'});
  }
});

module.exports = router;