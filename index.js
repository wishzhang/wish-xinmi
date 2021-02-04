const errorHandlerMiddleware = require('./middleware/error-handler-middleware');
const Koa = require('koa');
const koaBody = require('koa-body');
const router = require('./router/index');
const createSocketServer = require('./create-socket-server');

const app = new Koa();

app.use(koaBody());

// 静态资源
app.use(require('koa-static')('./public'));

// 服务器出错处理，报500
app.use(errorHandlerMiddleware());

// 请求路由表
app.use(router());

app.use(async ctx => {
  console.log(ctx.request.body);
  ctx.body = 'Hello World';
});

const server = createSocketServer(app);

function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

server.listen(3000, () => {
  console.log('http://localhost:3000');
  console.log(`http://${getIPAddress()}:3000`);
});