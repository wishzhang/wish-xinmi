import {io} from 'socket.io-client';

let socket = null;

const initSocket = (userId) => {
    if (socket === null) {
        socket = io('', {
            path: `${process.env.VUE_APP_BASE_API}/socket.io`,
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.warn('connected:' + socket.id);
            socket.emit('sessionOn', {userId: userId})
        });

        socket.on("connect_error", (err) => {
            setTimeout(() => {
                console.warn(err);
                console.warn('reconnect');
                socket.connect();
            }, 1000);
        });

        socket.on("disconnect", (err) => {
            console.warn(err);
            console.warn('disconnect')
        });
    }
}

export {
    initSocket,
    socket,
}
