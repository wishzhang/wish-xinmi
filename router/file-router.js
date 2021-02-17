const util = require('../util/index');
const fileUtil = require('../util/file-util');
const successRes = util.successRes;

const router = require('./router-factory')('/file');

router.post('/put', async (ctx) => {
    try {
        const file = ctx.request.files['file'];
        const resData = await fileUtil.putFile(file);
        ctx.body = successRes({data: resData});
    } catch (e) {
        console.log(e);
        ctx.body = successRes({code: 1, msg: '上传失败'});
    }
});

module.exports = router;