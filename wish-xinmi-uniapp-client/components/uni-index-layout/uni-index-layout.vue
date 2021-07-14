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
			...mapGetters(['userInfo', 'chatList', 'contactWarnNumStr'])
		},
		created() {
			const self = this

			initSocket(this.userInfo.username)

			if (socket) {
				socket.on('contact-add-contact', num => {
					self.$store.commit('SET_CONTACT_WARN_NUM', num)
				})

				socket.on('message-unread-onechat', data => {
					const ll = data.list;
					self.$store.commit('SET_CHAT_LIST', ll)
				})
			}
		},
		methods: {

		}
	}
</script>

<style scoped lang="scss">
	.uni-index-layout {
		position: relative;
		height: 100%;
	}
</style>
