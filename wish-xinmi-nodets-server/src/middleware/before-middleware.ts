import loginService from '../service/login-service'
import config from '../config'

export default () => {
    return (async (ctx: any, next: any) => {
        if (config.token.whiteList.includes(ctx.originalUrl)) {
            await next();
        } else {
            const headers = ctx.req.headers;
            const token = headers[config.token.header];
            try {
                const decode: any = loginService.verifyToken(token);
                ctx.userId = decode.userId;
                await next();
            } catch (e) {
                ctx.status = 401;
                ctx.body = '请求未授权';
            }
        }
    });
}