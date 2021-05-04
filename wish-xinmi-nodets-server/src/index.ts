// 加载环境配置
import config = require('./config');

import errorHandlerMiddleware from './middleware/error-handler-middleware';
import Koa = require('koa');

import koaBody = require('koa-body');

import initRouter = require('./router/index');
import socket = require('./socket/index');
import beforeMiddleware = require('./middleware/before-middleware');
import afterMiddleware = require('./middleware/after-middleware');

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

server.listen(config.serverPort, () => {
    console.log(`http://localhost:${config.serverPort}`);
    console.log(`http://${config.serverIp}:${config.serverPort}`);
});