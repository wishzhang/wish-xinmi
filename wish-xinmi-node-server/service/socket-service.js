const app = require('koa')();
const server = require('http').createServer(app.callback());
const options = { /* ... */ };
const io = require('socket.io')(server, options);

io.on('connection', socket => { /* ... */ });

server.listen(3000);