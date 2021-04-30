const contactSocket = require('./contact-socket');

const hashSocketId = {};
let io = {};

const emit = (emitName, targetAccount, resData) => {
    console.log(`向${targetAccount}发送消息：` + JSON.stringify(resData));

    let socketId = hashSocketId[targetAccount];
    if (socketId) {
        const s = io.to(socketId);
        s.emit(emitName, resData);
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
    ...contactSocket(emit)
}

