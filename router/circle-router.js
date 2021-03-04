const circleService = require('../service/circle-service');

const router = require('./router-factory')('/circle');

router.get('/getMineAllList', async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await circleService.getMineAllList({userId});
    ctx.body = R.success(list);
});

router.get('/getPage', async (ctx) => {
    const query = ctx.query;
    const current = query.current || L.defaultCurrent;
    const size = query.size || L.defaultSize;
    const res = await circleService.getAllCirclePage({current, size});
    ctx.body = R.success(res);
});

router.get('/getPeopleList', async (ctx) => {
    const query = ctx.query;
    const userId = query.id;
    const list = await circleService.getPeopleList({userId});
    ctx.body = R.success(list);
});

router.post('/addThought', async (ctx) => {
    const query = ctx.request.body;
    let photoFiles = ctx.request.files.photos;
    if (!Array.isArray(photoFiles)) {
        photoFiles = [photoFiles];
    }

    const createUser = query.createUser;
    const content = query.content;
    await circleService.addThought({createUser, content, photoFiles});
    ctx.body = R.success();
})

module.exports = router;