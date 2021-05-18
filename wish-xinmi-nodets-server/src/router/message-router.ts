import messageService from "../service/message-service";
import socket from "../socket";
import {routerFactory} from "./router-factory";
import R from "../util/response";

const router = routerFactory("/message");

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
    const userId = query.userId;
    const list = await messageService.getMineAllChatList(userId);
    ctx.body = R.success(list);
});

router.post("/addMessage", async (ctx: any) => {
    const {originUser, targetUser, content} = ctx.request.body;
    await messageService.addMessage(originUser, targetUser, content);
    socket.emitMessageToOneContact(originUser, targetUser, content);

    const messageChat = await messageService.getOneMessageChat(originUser, targetUser);
    socket.emitUnread(originUser, targetUser, messageChat);
    ctx.body = R.success();
});

router.post("/checkMessage", async (ctx: any) => {
    const {userId, contactId} = ctx.request.body;
    await messageService.checkMessage(userId, contactId);
    ctx.body = R.success();
});

export default router;