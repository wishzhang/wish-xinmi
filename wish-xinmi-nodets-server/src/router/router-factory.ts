const debug = require('../util/debug')('router');


const routerFactory = function (prefix: any) {
    const router = require('_koa-router@10.0.0@koa-router')({
        prefix: prefix
    });

    return {
        get(path: any, callback: any) {
            return router.get(path, async (ctx: any, next: any) => {
                debug('请求路径为：' + ctx.request.path);
                await callback(ctx);
                next();
            });
        },
        post(path: any, callback: any) {
            return router.post(path, async (ctx: any, next: any) => {
                debug('请求路径为：' + ctx.request.path);
                await callback(ctx);
                next();
            });
        },
        all(path: any, callback: any) {
            return router.all(path, async (ctx: any, next: any) => {
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

export = routerFactory;