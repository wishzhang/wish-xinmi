import messageService = require("../service/message-service");
import socket = require("../socket");
const router = require("./router-factory")("/message");
import R from "../util/response";

router.get("/getContactMessagePage", async (ctx: any) => {
    const query = ctx.query;
    const originUser = query.originUser;
    const targetUser = query.targetUser;
    const current = query.current;
    const size = query.size;
    const list = await messageService.getContactMessagePage({originUser, targetUser, current, size});
    ctx.body = R.success(list);
});

router.get("/getMineAllChatList", async (ctx: any) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await messageService.getMineAllChatList(userId);
    ctx.body = R.success(list);
});

router.post("/addMessage", async (ctx: any) => {
    const {originUser, targetUser, content} = ctx.request.body;
    await messageService.addMessage(originUser, targetUser, content);
    socket.emitMessageToOneContact(originUser,targetUser,content);

    const messageChat = await messageService.getOneMessageChat(originUser, targetUser);
    socket.emitUnread(originUser, targetUser, messageChat);
    ctx.body = R.success();
});

router.post("/checkMessage", async (ctx: any) => {
    const {userId, contactId} = ctx.request.body;
    await messageService.checkMessage(userId, contactId);
    ctx.body = R.success();
});

export = router;