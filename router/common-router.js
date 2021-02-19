const util = require('../util/index');
const successRes = util.successRes;

const router = require('./router-factory')('/common');

router.get('/serverTime', async (ctx) => {
    ctx.body = successRes({data: {serverTime: new Date()}});
});

module.exports = router;