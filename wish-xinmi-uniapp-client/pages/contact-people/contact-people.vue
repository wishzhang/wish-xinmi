<template>
	<view>
		<u-navbar back-text="000001"></u-navbar>
		<uni-list :border="false">
			<uni-list-item title="00002" note="信迷号:00002">
				<template slot="header">
					<uni-avatar style="margin-right: 22rpx;"></uni-avatar>
				</template>
			</uni-list-item>

			<uni-list-item title="朋友圈" link clickable @click="onToThoughtPeople"></uni-list-item>
		</uni-list>
		<u-button style="margin-top: 60rpx;" type="default" @click="onToChat">发消息</u-button>
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
			},
			onToChat(){
				uni.navigateTo({
					url: '/pages/chat/chat'
				})
			},
			onToThoughtPeople(){
				uni.navigateTo({
					url: '/pages/thought-people/thought-people'
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
