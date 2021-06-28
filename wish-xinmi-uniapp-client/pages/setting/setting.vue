<template>
	<uni-index-layout>
		<uni-navbar title="设置"></uni-navbar>
		<uni-list :border="true">
			<uni-list-item title="邮箱" rightText="121312@qq.com" to="/pages/setting-edit-email/setting-edit-email" link>
			</uni-list-item>
			<uni-list-item title="密码" rightText="修改密码" to="/pages/setting-edit-psw/setting-edit-psw" link>
			</uni-list-item>
		</uni-list>

		<view class="login-out" @click="onLoginOut">退出登录</view>
	</uni-index-layout>
</template>

<script>
	import {
		socket
	} from "@/common/socket"
	import {
		mapGetters
	} from 'vuex'

	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			onLoginOut() {
				this.$store.dispatch('Logout').then(() => {
					if (socket !== null) {
						socket.emit('sessionOff', {
							account: this.userInfo.username
						})
						socket.disconnect()
					}
					uni.reLaunch({
						url: '/pages/login/login'
					})
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		height: 100%;
	}

	.login-out {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 100rpx;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background-color: white;
	}
</style>
