import fileUtil from "../util/file-util";
import R from "../util/response";
import {routerFactory} from "./router-factory";

const router = routerFactory("/file");

router.post("/put", async (ctx: any) => {
    const file = ctx.request.files["file"];
    const resData = await fileUtil.putFile(file);
    ctx.body = R.success(resData);
});

export default router;