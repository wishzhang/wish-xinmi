<template>
	<view>
		<uni-nav-bar :statusBar="true" left-icon="back" title="朋友圈" @clickLeft="onClickLeft">
			<template slot="right">
				<uni-icons type="camera-filled" size="22" :color="$style.uniColorPrimary" @click="onToThoughtSendPage">
				</uni-icons>
			</template>
		</uni-nav-bar>

		<view class="bg-box">
			<image style="width: 100%; height: 200px; background-color: #eeeeee;" src="/static/img/bg1.jpg"></image>

			<view class="avatar-box">
				<text class="name">000001</text>
				<uni-avatar class="avatar"></uni-avatar>
			</view>
		</view>

		<view class="thought-list">
			<view class="thought-item">
				<view class="thought-item-left">
					<uni-avatar></uni-avatar>
				</view>
				<view class="thought-item-right">
					<text class="name">000001</text>
					<text class="text">asdfas</text>
					<view class="media">
						<uni-gallery-nine :list="list1"></uni-gallery-nine>
					</view>
					<text class="time">昨天</text>
				</view>
			</view>

			<view class="thought-item">
				<view class="thought-item-left">
					<uni-avatar></uni-avatar>
				</view>
				<view class="thought-item-right">
					<text class="name">000001</text>
					<text class="text">asdfas</text>
					<view class="media">
						<uni-gallery-nine :list="list2"></uni-gallery-nine>
					</view>
					<text class="time">昨天</text>
				</view>
			</view>

			<view class="thought-item">
				<view class="thought-item-left">
					<uni-avatar></uni-avatar>
				</view>
				<view class="thought-item-right">
					<text class="name">000001</text>
					<text class="text">asdfas</text>
					<view class="media">
						<uni-gallery-nine :list="list3"></uni-gallery-nine>
					</view>
					<text class="time">昨天</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				list1: ['asdf'],
				list2: ['asdf', 'asdf', 'asdf', 'asdf'],
				list3: ['asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf', 'asdf'],
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

<style scoped lang="scss">
	.bg-box {
		position: relative;
	}

	.avatar-box {
		position: absolute;
		right: $uni-padding-horizontal;
		bottom: -18rpx;
		display: flex;
		align-items: center;

		.name {
			color: white;
			margin-right: $uni-padding-horizontal - 10rpx;
		}
	}

	.thought-list {
		padding-top: 120rpx;

		.thought-item {
			display: flex;
			border-bottom: 1rpx solid $uni-border-color;
			padding: 28rpx $uni-padding-horizontal 14rpx;

			.thought-item-left {
				margin-right: 20rpx;
			}

			.thought-item-right {
				flex: 1;
				padding: 10rpx 0;

				.name {
					display: block;
					font-weight: 700;
					font-family: PingFangSC-Regular;
					color: #008b8b;
				}

				.text {
					display: block;
					padding: 10rpx 0 20rpx 0;
				}

				.media {}

				.time {
					display: block;
					margin-top: 14rpx;
				}
			}
		}
	}
</style>
