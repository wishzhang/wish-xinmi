<template>
	<uni-index-layout>
		<uni-navbar title="设置"></uni-navbar>

		<uni-cell-group :border="false">
			<uni-cell-item title="邮箱" :value="userInfo.emailAddress" to="/pages/setting-edit-email/setting-edit-email">
			</uni-cell-item>
			<uni-cell-item title="密码" :value="'修改密码'" to="/pages/setting-edit-psw/setting-edit-psw"></uni-cell-item>
		</uni-cell-group>

		<uni-cell-group class="login-out" :border="false">
			<uni-cell-item :border-bottom="false" :title-style="{width:'100%', textAlign: 'center'}" 
			:arrow="false"
			title="退出登录" @click="onLoginOut">
			</uni-cell-item>
		</uni-cell-group>
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
