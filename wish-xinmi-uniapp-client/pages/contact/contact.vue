<template>
	<view style="position:relative;height:100%;overflow: hidden;">
		<uni-list :border="true">
			<!-- 显示圆形头像 -->
			<uni-list-item title="新的朋友" clickable @click="onToContactConfirm">
				<template slot="header">
					<view class="iconfont iconlianxiren3 new-contact"></view>
				</template>
			</uni-list-item>
		</uni-list>

		<uni-list :border="false">
			<view class="group-title uni-padding-wrap">#</view>
			<!-- 显示圆形头像 -->
			<uni-list-item title="uni-app" clickable @click="onToContactPeople">
				<view style="margin-right: 22rpx;" slot="header">
					<uni-avatar ></uni-avatar>
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
			},
			onToContactPeople(){
				uni.navigateTo({
					url: '/pages/contact-people/contact-people'
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

	/deep/ {
		.uni-list-item__content-title,
		.uni-list-chat__content-title {
			position: relative;
			top: 24rpx;
		}
	}

	.new-contact {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 86rpx;
		height: 86rpx;
		color: white;
		background-color: #07C160;
		border-radius: $uni-border-radius-base;
		font-size: 64rpx;
		margin-right: 22rpx;
	}
</style>
