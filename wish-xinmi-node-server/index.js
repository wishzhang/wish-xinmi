// 加载环境配置
const config = require('./config');
global.config = config;

const errorHandlerMiddleware = require('./middleware/error-handler-middleware');
const Koa = require('koa');
const koaBody = require('koa-body');
const initRouter = require('./router/index');
const socket = require('./socket/index');
const fileUploader = require('./util/file-util');
const beforeMiddleware = require('./middleware/before-middleware');
const afterMiddleware = require('./middleware/after-middleware');
const Operation = require('./util/sql-util');
const ResUtil = require('./util/res-util');

/**
 * 赋值全局变量
 */
// 数据库工具
Object.defineProperty(global, 'L', {
    set(v) {
    },
    get() {
        return new Operation();
    }
})
// 响应工具
Object.defineProperty(global, 'R', {
    value: ResUtil
})

const app = new Koa();

app.use(beforeMiddleware());

app.use(koaBody({multipart: true}));

// 静态资源
app.use(require('koa-static')('./public'));

// 服务器出错处理，报500
app.use(errorHandlerMiddleware());

// 请求路由表
initRouter(app);

// minio中间件
app.use(afterMiddleware());

const server = require('http').createServer(app.callback());
socket.init(server);

server.listen(global.config.serverPort, () => {
    console.log(`http://localhost:${global.config.serverPort}`);
    console.log(`http://${global.config.serverIp}:${global.config.serverPort}`);
});