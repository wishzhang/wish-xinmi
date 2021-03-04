const messageService = require('../service/message-service');

const router = require('./router-factory')('/message');

router.get('/getContactMessageList', async (ctx) => {
    const query = ctx.query;
    const originUser = query.originUser;
    const targetUser = query.targetUser;
    const list = await messageService.getContactMessageList({originUser, targetUser});
    ctx.body = R.success(list);
})

router.get('/getMineAllChatList', async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await messageService.getMineAllChatList({userId});
    ctx.body = R.success(list);
})

router.get('/addMessage', async (ctx) => {
    const query = ctx.query;
    const originUser = query.originUser;
    const targetUser = query.targetUser;
    const content = query.content;
    const list = await messageService.addMessage({originUser, targetUser, content});
    ctx.body = R.success(list);
})

router.get('/getAllMessagePage', async (ctx) => {
    const query = ctx.query;
    let current = query.current || L.defaultCurrent;
    let size = query.size || L.defaultSize;
    const data = await messageService.getAllMessagePage({current, size});
    ctx.body = R.success(data);
})

module.exports = router;