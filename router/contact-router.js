const contactService = require('../service/contact-service');

const router = require('./router-factory')('/contact');

router.get('/getYesContactList', async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await contactService.getYesContactList({userId});
    ctx.body = R.success(list);
})

router.get('/addContact', async (ctx) => {
    const query = ctx.request.query;
    const userId = query.id;
    const contactId = query.contactId;
    const validateMsg = query.validateMsg;
    await contactService.addContact({userId, contactId, validateMsg});
    ctx.body = R.success();
})

router.get('/getNoContactList', async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const username = query.username || '';
    const list = await contactService.getNoContactList({userId, username});
    ctx.body = R.success(list);
})

router.get('/getConfirmContactList', async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await contactService.getConfirmContactList({userId});
    ctx.body = R.success(list);
})

router.get('/confirmContact', async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const contactId = query.contactId;
    await contactService.confirmContact({userId, contactId});
    ctx.body = R.success();
});

router.get('/getUserContactStatus', async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const contactId = query.contactId;
    const list = await contactService.getUserContactStatus({userId, contactId});
    ctx.body = R.success(list[0].status);
});

router.get('/getContactInfoHad', async (ctx) => {
    const query = ctx.query;
    const userId = query.userId;
    const contactId = query.contactId;
    const list = await contactService.getContactInfoHad({userId, contactId});
    ctx.body = R.success(list[0]);
});

module.exports = router;