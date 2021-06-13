<template>
	<view>
		<u-navbar back-text="000001"></u-navbar>

		<view class="bg-box">
			<image style="width: 100%; height: 200px; background-color: #eeeeee;" src="/static/img/bg1.jpg"></image>

			<view class="avatar-box">
				<text class="name">000001</text>
				<uni-avatar class="avatar"></uni-avatar>
			</view>
		</view>

		<view class="thought-list">
			<view class="thought-item-group">
				<text class="year">2021年</text>

				<view class="thought-item">
					<view class="thought-item-left">
						<text class="day">12</text>
						<text class="month">06月</text>
					</view>
					<view class="thought-item-right">
						<text class="text">asdfas</text>
						<view class="media">
							<uni-gallery-four :list="list1"></uni-gallery-four>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list1: ['asdf']
			}
		},
		methods: {
			onClickLeft() {
				uni.navigateBack({

				})
			},
			onToThoughtSendPage() {
				uni.navigateTo({
					url: '/pages/thought-send/thought-send'
				})
			}
		}
	}
</script>

<style scope scoped lang="scss">
	page {
		background-color: white;
	}

	.bg-box {
		position: relative;
	}

	.avatar-box {
		position: absolute;
		right: $uni-padding-horizontal;
		bottom: -16rpx;
		display: flex;
		align-items: center;

		.name {
			color: white;
			margin-right: $uni-padding-horizontal - 10rpx;
		}
	}

	.thought-list {
		padding-top: 120rpx;

		.thought-item-group {
			.year {
				font-size: 50rpx;
				font-weight: bold;
				padding-left: $uni-padding-horizontal;
			}

			.thought-item {
				display: flex;
				border-bottom: 1rpx solid $uni-border-color;
				padding: 28rpx $uni-padding-horizontal 14rpx;

				.thought-item-left {
					margin-right: 20rpx;

					.day {
						font-size: 50rpx;
						font-weight: bold;
						padding-right: 4rpx;
					}

					.month {
						font-size: $uni-font-size-base;
						font-weight: bold;
					}
				}

				.thought-item-right {
					flex: 1;
					padding: 0 0 10rpx 0;

					.text {
						display: block;
						padding: 20rpx 0 20rpx 0;
						background-color: $uni-bg-color-grey;
						margin-bottom: 20rpx;
					}

					.media {}
				}
			}
		}

	}
</style>
