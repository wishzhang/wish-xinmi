const errorHandlerMiddleware = require('./middleware/error-handler-middleware');
const Koa = require('koa');
const koaBody = require('koa-body');
const initRouter = require('./router/index');
const createSocketServer = require('./create-socket-server');
const fileUploader = require('./util/file-util');
const ip = require('./util/index').getIPAddress();
const afterMiddleware = require('./middleware/after-middleware');

const app = new Koa();

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

server.listen(3000, () => {
  console.log('http://localhost:3000');
  console.log(`http://${ip}:3000`);
});