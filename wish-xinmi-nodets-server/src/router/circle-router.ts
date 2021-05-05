import circleService = require("../service/circle-service");
import R from "../util/response";

const router: any = require("./router-factory")("/circle");

router.get("/getPage", async (ctx: any) => {
    const query = ctx.query;
    const current = query.current;
    const size = query.size;
    const userId = query.userId;
    const res = await circleService.getPage(userId, current, size);
    ctx.body = R.success(res);
});

router.get("/getUserThoughtPage", async (ctx: any) => {
    const query = ctx.query;
    const userId = query.userId;
    const current = query.current;
    const size = query.size;
    const data = await circleService.getUserThoughtPage(userId, current, size);
    ctx.body = R.success(data);
});

router.post("/addThought", async (ctx: any) => {
    const query = ctx.request.body;
    let photoFiles = ctx.request.files.photos;

    if (!Array.isArray(photoFiles) && typeof photoFiles === "object" && photoFiles.type) {
        photoFiles = [photoFiles];
    }

    const createUser = query.createUser;
    const content = query.content;
    await circleService.addThought(createUser, content, photoFiles);
    ctx.body = R.success();
});

export = router;