import {io} from 'socket.io-client';

let socket = null;

const initSocket = (userId) => {
  if(socket === null){
    socket = io('http://192.168.1.101:3000', {
      path: '/socket.io',
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