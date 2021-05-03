const messageService = require('../service/message-service');
const socket = require('../socket/index');
const router = require('./router-factory')('/message');

router.get('/getContactMessagePage', async (ctx) => {
    const query = ctx.query;
    const originUser = query.originUser;
    const targetUser = query.targetUser;
    const current = query.current;
    const size = query.size;
    const list = await messageService.getContactMessagePage({originUser, targetUser, current, size});
    ctx.body = R.success(list);
})

router.get('/getMineAllChatList', async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await messageService.getMineAllChatList({userId});
    ctx.body = R.success(list);
})

router.post('/addMessage', async (ctx) => {
    const {originUser, targetUser, content} = ctx.request.body
    await messageService.addMessage({originUser, targetUser, content});
    socket.emitMessageToOneContact({
        originUserId: originUser,
        targetUserId: targetUser,
        data: content
    });

    const messageChat = await messageService.getOneMessageChat({originUser, targetUser});
    socket.emitUnread({
        originUser,
        targetUser,
        data: {
            ...messageChat
        }
    });
    ctx.body = R.success();
})

router.get('/getAllMessagePage', async (ctx) => {
    const query = ctx.query;
    let current = query.current || L.defaultCurrent;
    let size = query.size || L.defaultSize;
    const data = await messageService.getAllMessagePage({current, size});
    ctx.body = R.success(data);
})

router.post('/checkMessage', async (ctx) => {
    const {userId, contactId} = ctx.request.body;
    await messageService.checkMessage({userId, contactId});
    ctx.body = R.success();
})

module.exports = router;