import fileUtil = require("../util/file-util");
import R from "../util/response";

const router = require("./router-factory")("/file");

router.post("/put", async (ctx: any) => {
    const file = ctx.request.files["file"];
    const resData = await fileUtil.putFile(file);
    ctx.body = R.success(resData);
});

module.exports = router;