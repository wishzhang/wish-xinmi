import contactService from "../service/contact-service";
import R from "../util/response";
import userService from "../service/user-service";
import socket from "../socket";
import {routerFactory} from "./router-factory";
import Joi from 'joi';

const router = routerFactory("/contact");

router.get("/getYesContactList", async (ctx: any) => {
    const query = ctx.query;
    const {userId} = query;

    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户');
    }

    const list = await contactService.getYesContactList(userId);
    ctx.body = R.success(list);
});

router.get("/addContact", async (ctx: any) => {
    const {userId, contactId, validateMsg} = ctx.query;

    if (!await userService.hasUser(userId)) {
        throw Error(`找不到${userId}`);
    }

    if (!await userService.hasUser(contactId)) {
        throw Error(`找不到${contactId}`);
    }

    const r = await contactService.addContact(userId, contactId, validateMsg);

    if (r) {
        await socket.emitContactAddContact(userId, contactId);
    }

    ctx.body = R.success();
});

router.get("/getNoContactList", async (ctx: any) => {
    const query = ctx.query;
    const {userId, username = ''} = query;

    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户');
    }

    const list = await contactService.getNoContactList(userId, username);
    ctx.body = R.success(list);
});

router.get("/getConfirmContactList", async (ctx: any) => {
    const query = ctx.query;
    const userId = query.userId;

    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户');
    }

    const list = await contactService.getConfirmContactList(userId);
    ctx.body = R.success(list);
});

router.get("/confirmContact", async (ctx: any) => {
    const query = ctx.query;
    const {userId, contactId} = query;

    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户');
    }

    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户');
    }

    await contactService.confirmContact(userId, contactId);
    ctx.body = R.success();
});

router.get("/getUserContactStatus", async (ctx: any) => {
    const query = ctx.query;
    const {userId, contactId} = query;
    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户' + userId);
    }

    if (!await userService.hasUser(contactId)) {
        throw Error('找不到用户' + contactId);
    }

    const status = await contactService.getUserContactStatus(userId, contactId);
    ctx.body = R.success(status);
});

router.get("/getContactInfoHad", async (ctx: any) => {
    const query = ctx.query;
    const {userId, contactId} = query;
    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户' + userId);
    }

    if (!await userService.hasUser(contactId)) {
        throw Error('找不到用户' + contactId);
    }

    const info = await contactService.getContactInfoHad(userId, contactId);
    ctx.body = R.success(info);
});

/**
 * 获取联系人的提醒数量，目前为未查看的待确认记录的数量
 */
router.get("/getContactWarnNum", async (ctx: any) => {
    const {userId} = ctx.query;

    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户' + userId);
    }

    const num = await contactService.getContactWarnNum(userId);
    ctx.body = R.success(num);
});

/**
 * 将该用户对应的联系人设置为已读
 */
router.post("/setAllContactChecked", async (ctx: any) => {
    const {userId} = ctx.request.body;

    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户' + userId);
    }

    await contactService.setAllContactChecked(userId);
    ctx.body = R.success();
});

/**
 * 修改联想人信息
 */
router.post("/editContact", async (ctx: any) => {
    const {userId, contactId, contactName} = ctx.request.body;

    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户' + userId);
    }

    if (!await userService.hasUser(contactId)) {
        throw Error('找不到用户' + contactId);
    }


    await contactService.editContact(userId, contactId, contactName);
    ctx.body = R.success();
});

/**
 * 删除联想人
 */
router.post("/deleteContact", async (ctx: any) => {
    const {userId, contactId} = ctx.request.body;
    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户' + userId);
    }

    if (!await userService.hasUser(contactId)) {
        throw Error('找不到用户' + contactId);
    }

    const is = await contactService.isContact(userId, contactId);
    if (!is) {
        throw Error(`${userId}没有联系人${contactId}`);
    }

    await contactService.deleteContact(userId, contactId);
    ctx.body = R.success();
});

export default router;