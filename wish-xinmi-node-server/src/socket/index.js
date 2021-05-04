const contactSocket = require('./contact-socket');
const messageSocket = require('./message-socket');
const userService = require('../service/user-service');

const hashSocketId = {};
let io = {};

const emit = async (emitName, {originUserId, targetUserId, data}) => {
    const targetUser = await userService.getOneUser({userId: targetUserId});
    const originUser = await userService.getOneUser({userId: originUserId});

    console.log(`${originUser.username}向${targetUser.username}发送消息：` + JSON.stringify(data));

    let socketId = hashSocketId[targetUser.username];
    if (socketId) {
        const s = io.to(socketId);
        s.emit(emitName, data);
    }
}

module.exports = {
    init: (server) => {
        const options = {
            cors: {
                "origin": /.*/ig,
                "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
                credentials: true,
            }
        };

        io = require('socket.io')(server, options);

        io.on('connection', socket => {

            socket.on("sessionOff", ({account}) => {
                console.log(`下线：${account}`);
                delete hashSocketId[account];
            });

            socket.on('sessionOn', ({account}) => {
                console.log(`上线：${account}`);
                hashSocketId[account] = socket.id;
            })
        });
    },
    ...contactSocket(emit),
    ...messageSocket(emit),
}

