import circleService from "../service/circle-service";
import R from "../util/response";
import Joi from 'joi';

import {routerFactory} from "./router-factory";
import userService from '../service/user-service';

const router: any = routerFactory("/circle");

router.get("/getPage", async (ctx: any) => {
    const query = ctx.query;
    const {current, size, userId} = query;

    const schema = Joi.object({
        current: Joi.number(),
        size: Joi.number()
    })
    try {
        await schema.validateAsync({current, size});
    } catch (e) {
        throw e.message;
    }

    if (!await userService.hasUser(userId)) {
        throw '找不到用户';
    }

    const res = await circleService.getPage(userId, current, size);
    ctx.body = R.success(res);
});

router.get("/getUserThoughtPage", async (ctx: any) => {
    const query = ctx.query;
    const {userId, current, size} = query;

    const schema = Joi.object({
        current: Joi.number(),
        size: Joi.number()
    })
    try {
        await schema.validateAsync({current, size});
    } catch (e) {
        throw e.message;
    }

    if (!await userService.hasUser(userId)) {
        throw Error('找不到用户');
    }

    const data = await circleService.getUserThoughtPage(userId, current, size);
    ctx.body = R.success(data);
});

router.post("/addThought", async (ctx: any) => {
    const query = ctx.request.body;
    let photoFiles = ctx.request.files.photos;

    if (!Array.isArray(photoFiles) && typeof photoFiles === "object" && photoFiles.type) {
        photoFiles = [photoFiles];
    }

    const {createUser, content} = query;
    if (!await userService.hasUser(createUser)) {
        throw Error('找不到用户');
    }

    await circleService.addThought(createUser, content, photoFiles);
    ctx.body = R.success();
});

export default router;