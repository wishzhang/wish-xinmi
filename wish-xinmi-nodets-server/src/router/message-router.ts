import messageService from "../service/message-service";
import contactService from '../service/contact-service';
import userService from '../service/user-service';
import Joi from 'joi';
import socket from "../socket";
import {routerFactory} from "./router-factory";
import R from "../util/response";

const router = routerFactory("/message");

router.get("/getContactMessagePage", async (ctx: any) => {
    const query = ctx.query;
    const {originUser, targetUser, current, size} = query;

    if (!contactService.isContact(originUser, targetUser)) {
        throw Error(`${originUser}没有联系人${targetUser}`);
    }

    const list = await messageService.getContactMessagePage({originUser, targetUser, current, size});
    ctx.body = R.success(list);
});

router.get("/getMineAllChatList", async (ctx: any) => {
    const query = ctx.query;
    const userId = query.userId;

    if (!await userService.hasUser(userId)) {
        throw Error('没有找到这个用户' + userId);
    }

    const list = await messageService.getMineAllChatList(userId);
    ctx.body = R.success(list);
});

router.post("/addMessage", async (ctx: any) => {
    const {originUser, targetUser, content} = ctx.request.body;

    const schema = Joi.object({
        content: Joi.string().required()
    });
    try {
        await schema.validateAsync({content});
    } catch (e) {
        throw e.message;
    }

    if (!await contactService.isContact(originUser, targetUser)) {
        throw Error(`${originUser}没有联系人${targetUser}`);
    }

    await messageService.addMessage(originUser, targetUser, content);
    socket.emitMessageToOneContact(originUser, targetUser, content);

    const messageChat = await messageService.getOneMessageChat(originUser, targetUser);
    socket.emitUnread(originUser, targetUser, messageChat);
    ctx.body = R.success();
});

router.post("/checkMessage", async (ctx: any) => {
    const {userId, contactId} = ctx.request.body;
    if (!await contactService.isContact(userId, contactId)) {
        throw Error(`${userId}没有联系人${contactId}`);
    }

    await messageService.checkMessage(userId, contactId);
    ctx.body = R.success();
});

export default router;