import {io} from 'socket.io-client';

let socket = null;

const withTimeout = (onSuccess, onTimeout, timeout) => {
    let called = false;

    const timer = setTimeout(() => {
        if (called) return;
        called = true;
        onTimeout();
    }, timeout);

    return (...args) => {
        if (called) return;
        called = true;
        clearTimeout(timer);
        onSuccess.apply(this, args);
    }
}

const initSocket = (account) => {
    if (socket === null) {
        socket = io('', {
            path: `${process.env.VUE_APP_BASE_API}/socket.io`,
            withCredentials: true,
        });

        socket.on("connect", () => {
            console.warn('connected:' + socket.id);
            socket.emit('sessionOn', {account});
        });

        socket.on("connect_error", (err) => {
            console.warn('connect_error:', err);
        });

        socket.on("disconnect", (err) => {
            console.warn('disconnect:', err);
        });

        return socket;
    }
}

export {
    initSocket,
    socket,
}
