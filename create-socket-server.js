const util = require('./util/index');
const successRes = util.successRes;
const messageService = require('./service/message-service');

module.exports = (koaInstance) => {
  const server = require('http').createServer(koaInstance.callback());

  const hashSocketId = {};
  const options = {
    cors: {
      "origin": /.*/ig,
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,
    }
  };
  const io = require('socket.io')(server, options);
  io.on('connection', socket => {
    const sendMsg = (originUser, targetUser, content) => {
      const data = {originUser, targetUser, content};
      console.log(`向${targetUser}发送消息：` + content);
      console.log(hashSocketId);
      let socketId = hashSocketId[targetUser]
      if (socketId) {
        const s = io.to(socketId);
        s.send(successRes({data: data}));
      } else {
        socket.send(successRes({code: 1, msg: '对方不在线'}));
      }
    }

    socket.on("sessionOff", ({userId}) => {
      console.log(`下线：${userId}`);
      delete hashSocketId[userId];
    });

    socket.on('sessionOn', ({userId}) => {
      console.log(`上线：${userId}`);
      hashSocketId[userId] = socket.id;
    })

    socket.on('message', async (data) => {
      const {originUser, targetUser, content} = data;
      await messageService.addMessage({originUser, targetUser, content});
      sendMsg(originUser, targetUser, content);
    });
  });

  return server;
}