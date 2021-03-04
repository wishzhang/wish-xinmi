const router = require('./router-factory')('/common');

router.get('/serverTime', async (ctx) => {
    ctx.body = R.success({serverTime: new Date()});
});

module.exports = router;