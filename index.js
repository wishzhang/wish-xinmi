// 加载环境配置
const configDev = require('./config.dev');
var configProd = require('./config.prod');
global.config = process.env.NODE_ENV === "development" ? configDev : configProd;

const errorHandlerMiddleware = require('./middleware/error-handler-middleware');
const Koa = require('koa');
const koaBody = require('koa-body');
const initRouter = require('./router/index');
const createSocketServer = require('./create-socket-server');
const fileUploader = require('./util/file-util');
const beforeMiddleware = require('./middleware/before-middleware');
const afterMiddleware = require('./middleware/after-middleware');
const Operation = require('./util/sql-util');

// 赋值全局变量
Object.defineProperty(global, 'L', {
  set(v) {
  },
  get() {
    return new Operation();
  }
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

const server = createSocketServer(app);

server.listen(global.config.serverPort, () => {
  console.log(`http://localhost:${global.config.serverPort}`);
  console.log(`http://${global.config.serverIp}:${global.config.serverPort}`);
});