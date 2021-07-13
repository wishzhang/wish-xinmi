<template>
	<view class="bg-box">
		<u-image width="100%" :height="height" :src="bgSrc" @click="onBgClick">
			<u-image slot="error" width="100%" :height="height" src="/static/img/bg-default.jpg"></u-image>
		</u-image>

		<view class="avatar-box">
			<text class="name">{{name}}</text>
			<uni-avatar size="large" class="avatar" :src="avatarSrc" :to-user="toUser" @click="onAvatarClick"></uni-avatar>
		</view>
	</view>   
</template>

<script>
	export default {
		props: {
			bgSrc: {
				required: true
			},
			avatarSrc: {
				required: true
			},
			name: {
				required: true
			},
			height: {
				type: Number,
				default: 460
			},
			toUser: {
				type: String,
				required: true
			}
		},
		data() {
			return {}
		},
		methods: {
			onBgClick() {
				this.$emit('bg-click')
			},
			onAvatarClick() {
				this.$emit('avatar-click')
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
		bottom: -28rpx;
		display: flex;
		align-items: center;

		.name {
			color: white;
			margin-right: $uni-padding-horizontal - 10rpx;
		}
	}
</style>
