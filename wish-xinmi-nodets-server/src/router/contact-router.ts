import contactService = require('../service/contact-service');
import R from '../util/response';
import userService = require('../service/user-service');
import socket = require('../socket');

const router = require('./router-factory')('/contact');

router.get('/getYesContactList', async (ctx: any) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await contactService.getYesContactList(userId);
    ctx.body = R.success(list);
})

router.get('/addContact', async (ctx: any) => {
    const {id, contactId, validateMsg} = ctx.query;

    const status = await contactService.addContact(id, contactId, validateMsg);

    if (status === 1) {
        await socket.emitContactAddContact(id, contactId);
    }

    ctx.body = R.success();
})

router.get('/getNoContactList', async (ctx: any) => {
    const query = ctx.query;
    const userId = query.id;
    const username = query.username || '';
    const list = await contactService.getNoContactList(userId, username);
    ctx.body = R.success(list);
})

router.get('/getConfirmContactList', async (ctx: any) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await contactService.getConfirmContactList(userId);
    ctx.body = R.success(list);
})

router.get('/confirmContact', async (ctx: any) => {
    const query = ctx.query;
    const userId = query.id;
    const contactId = query.contactId;
    await contactService.confirmContact(userId, contactId);
    ctx.body = R.success();
});

router.get('/getUserContactStatus', async (ctx: any) => {
    const query = ctx.query;
    const userId = query.id;
    const contactId = query.contactId;
    const list:any = await contactService.getUserContactStatus(userId, contactId);
    if (list.length > 0) {
        ctx.body = R.success(list[0].status);
    } else {
        ctx.body = R.fail(1, '这两个用户之间的状态：无!');
    }
});

router.get('/getContactInfoHad', async (ctx: any) => {
    const query = ctx.query;
    const userId = query.userId;
    const contactId = query.contactId;
    const info = await contactService.getContactInfoHad(userId, contactId);
    ctx.body = R.success(info);
});

/**
 * 获取联系人的提醒数量，目前为未查看的待确认记录的数量
 */
router.get('/getContactWarnNum', async (ctx: any) => {
    const {userId} = ctx.query;
    const num = await contactService.getContactWarnNum({userId});
    ctx.body = R.success(num);
})

/**
 * 将该用户对应的联系人设置为已读
 */
router.post('/setAllContactChecked', async (ctx: any) => {
    const {userId} = ctx.request.body;
    await contactService.setAllContactChecked({userId});
    ctx.body = R.success();
})

/**
 * 修改联想人信息
 */
router.post('/editContact', async (ctx: any) => {
    const {userId, contactId, contactName} = ctx.request.body;
    await contactService.editContact(userId, contactId, contactName);
    ctx.body = R.success();
})

/**
 * 删除联想人
 */
router.post('/deleteContact', async (ctx: any) => {
    const {userId, contactId} = ctx.request.body;
    await contactService.deleteContact(userId, contactId);
    ctx.body = R.success();
})

export = router;