<template>
	<view class="uni-gallery-nine">
		<template v-if="list.length===1">
			<view class="list-length-1">
				<image class="image" key="fasd" src="/static/img/bg1.jpg" @click="onImageClick"></image>
			</view>
		</template>
		<template v-else-if="list.length===4">
			<view class="list-length-4">
				<image class="image" src="/static/img/bg1.jpg" @click="onImageClick"></image>
				<image class="image" src="/static/img/bg2.jpg" @click="onImageClick"></image>
			</view>
			<view class="list-length-4">
				<image class="image" src="/static/img/bg3.jpg" @click="onImageClick"></image>
				<image class="image" src="/static/img/bg4.jpg" @click="onImageClick"></image>
			</view>
		</template>
		<template v-else>
			<view class="list-lenght-9">
				<template v-for="i in 9">
					<image class="image" src="/static/img/bg4.jpg" :key="i" @click="onImageClick"></image>
				</template>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default(){
					return []
				}
			}
		},
		methods: {
			onImageClick() {
				uni.previewImage({
					urls: ['/static/img/bg3.jpg'],
					fail() {
						uni.showToast({
							title: '预览图片失败',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	$maxWidth: 500rpx;
	$splitWidth: 10rpx;
	$borderRadius: $uni-border-radius-base;

	.split {
		margin-right: $splitWidth;
		margin-bottom: $splitWidth;
	}

	.list-length-1 {
		$width: $maxWidth/3*2;

		.image {
			width: $maxWidth/3*2;
			height: $width;
			border-radius: $borderRadius;
			@extend .split;
		}
	}

	.list-length-4 {
		$width: $maxWidth/3 - $splitWidth/2;
		$height: $width;
		font-size: 0;

		.image {
			width: $width;
			height: $height;
			border-radius: $borderRadius;
			@extend .split;
		}
	}

	.list-lenght-9 {
		$width: $maxWidth/3 - $splitWidth * 2/3;
		$height: $width;

		display: flex;
		flex-wrap: wrap;

		.image {
			width: $width;
			height: $height;
			border-radius: $borderRadius;
			@extend .split;
		}
	}
</style>
