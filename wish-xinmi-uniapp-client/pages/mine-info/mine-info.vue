<template>
	<view>
	<uni-navbar title="个人信息"></uni-navbar>
		<uni-list :border="false">
			<!-- 显示圆形头像 -->
			<uni-list-item style="padding: 20rpx 0;" title="头像" link>
				<template slot="footer">
					<uni-avatar size="large"></uni-avatar>
				</template>
			</uni-list-item>

			<uni-list-item title="00001">
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			onToContactConfirm() {
				uni.navigateTo({
					url: '/pages/contact-confirm/contact-confirm'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		height: 100%;
	}

	.group-title {
		background-color: $uni-bg-color-grey !important;
		padding-top: 10rpx !important;
		padding-bottom: 10rpx !important;
	}

	/deep/ .uni-list-item__content-title {
		margin: auto 0;
	}
</style>
