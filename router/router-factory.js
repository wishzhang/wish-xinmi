const debug = require('debug')('xinmi-router');

const routerFactory = function (prefix) {
    const router = require('koa-router')({
        prefix: prefix
    });

    return {
        get(path, callback) {
            return router.get(path, async (ctx, next) => {
                debug('请求路径为：' + ctx.request.path);
                await callback(ctx);
                next();
            });
        },
        post(path, callback) {
            return router.post(path, async (ctx, next) => {
                debug('请求路径为：' + ctx.request.path);
                await callback(ctx);
                next();
            });
        },
        routes() {
            return router.routes();
        }
    }
}

module.exports = routerFactory;