const fileUtil = require('../util/file-util');

const router = require('./router-factory')('/file');

router.post('/put', async (ctx) => {
    const file = ctx.request.files['file'];
    const resData = await fileUtil.putFile(file);
    ctx.body = R.success(resData);
});

module.exports = router;