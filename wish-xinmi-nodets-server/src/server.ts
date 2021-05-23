import errorHandlerMiddleware from "./middleware/error-handler-middleware";
import Koa from "koa";
import socket from "./socket/index";
import {setupDatabase} from "./dao/model";
import debug from './util/debug';

import koaBody from "koa-body";

import initRouter from "./router/index";

import beforeMiddleware from "./middleware/before-middleware";
import afterMiddleware from "./middleware/after-middleware";

const log = debug('server');

const app = new Koa();

setupDatabase();

app.use(beforeMiddleware());

app.use(koaBody({multipart: true}));

// 静态资源
app.use(require("koa-static")("./public"));

// 服务器出错处理，报500
app.use(errorHandlerMiddleware());

// 请求路由表
initRouter(app);

// minio中间件
app.use(afterMiddleware());

const server = require("http").createServer(app.callback());
socket.init(server);

export default server;