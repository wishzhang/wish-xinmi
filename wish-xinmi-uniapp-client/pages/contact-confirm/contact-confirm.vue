<template>
	<view>

		<uni-list :border="false">
			<uni-list-item title="uni-a发送到发pp" note="你好,我是00001">
				<view  style="margin-right: 22rpx;" slot="header">
					<uni-avatar></uni-avatar>
				</view>
				<view slot="footer">
					<u-button type="primary" size="mini" style="position:relative;top: 20rpx;">接受</u-button>
				</view>
			</uni-list-item>

			<uni-list-item title="uni-app" note="你好,我是00001">
				<view  style="margin-right: 22rpx;" slot="header">
					<uni-avatar></uni-avatar>
				</view>
				<view slot="footer">
					<text style="position:relative;top: 20rpx;" class="u-tips-color">已添加</text>
				</view>
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
</style>
