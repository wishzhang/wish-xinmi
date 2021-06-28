import io from '@hyoga/uni-socket.io'

let socket = null

function initSocket(account) {
	if (socket === null) {
		const globalData = getApp().globalData

		socket = io(globalData.origin, {
			path: globalData.socketPath,
			query: {},
			transports: ['websocket', 'polling'],
			withCredentials: true,
			timeout: 5000
		});

		socket.on("connect", () => {
			console.warn('connected:' + socket.id)
			socket.emit('sessionOn', {
				account
			})
		});


		socket.on("connect_error", (err) => {
			console.warn('connect_error:', err)
		});

		socket.on("disconnect", (err) => {
			console.warn('disconnect:', err)
		});

		return socket
	}
}

export {
	initSocket,
	socket,
}
