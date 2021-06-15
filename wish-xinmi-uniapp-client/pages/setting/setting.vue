<template>
	<view>
			<uni-navbar title="设置"></uni-navbar>
		<uni-list :border="true">
			<uni-list-item title="邮箱" rightText="121312@qq.com" to="/pages/setting-edit-email/setting-edit-email" link>
			</uni-list-item>
			<uni-list-item title="密码" rightText="修改密码" to="/pages/setting-edit-psw/setting-edit-psw" link>
			</uni-list-item>
		</uni-list>

		<view class="login-out" @click="onLoginOut">退出登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			onLoginOut() {
				uni.reLaunch({
					url: '/pages/login/login'
				})
			}
		}
	}
</script>

<style>
	.login-out {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 30px;
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background-color: white;
	}
</style>
