const router = require('./router-factory')('/common');
import R from '../util/response';

router.get('/serverTime', async (ctx: any) => {
    ctx.body = R.success({serverTime: new Date()});
});

export = router;