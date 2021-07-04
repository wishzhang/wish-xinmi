<template>
	<view class="uni-index-layout uni-height-full">
		<slot></slot>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		initSocket,
		socket
	} from '@/common/socket.js'

	export default {
		computed: {
			...mapGetters(['userInfo', 'chatList'])
		},
		created() {
			const self = this

			initSocket(this.userInfo.username)

			if (socket) {
				socket.on('contact-add-contact', num => {
					self.$store.commit('SET_CONTACT_WARN_NUM', num)
				})

				socket.on('message-unread-onechat', data => {
					if (data && data.chatId) {
						const chatId = data.chatId
						const chatList = JSON.parse(JSON.stringify(self.chatList))

						const index = chatList.findIndex(item => {
							return item.chatId === chatId
						})
						if (index !== -1) {
							chatList.splice(index, 1, data)
						} else {
							chatList.unshift(data)
						}

						self.$store.commit('SET_CHAT_LIST', chatList)
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">

	.uni-index-layout{
		position: relative;
		height: 100%;
	}
</style>
