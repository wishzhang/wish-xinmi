<template>
	<view class="uni-gallery-nine" v-if="list.length>0">
		<template v-if="list.length===1">
			<view class="list-length-1">
				<image class="image" key="fasd" src="/static/img/bg1.jpg" @click="onImageClick"></image>
			</view>
		</template>
		<template v-else-if="list.length===2">
			<view class="list-length-2">
				<image class="image" key="fasfasd" src="/static/img/bg1.jpg" @click="onImageClick"></image>
				<image class="image" key="faasasd" src="/static/img/bg2.jpg" @click="onImageClick"></image>
			</view>
		</template>
		<template v-else-if="list.length===3">
			<view class="list-length-3">
				<image class="image image1" key="fasd12" src="/static/img/bg1.jpg" @click="onImageClick"></image>
				<view>
					<image class="image image2" key="fasd23" src="/static/img/bg2.jpg" @click="onImageClick"></image>
					<image class="image image3" key="fasdre" src="/static/img/bg3.jpg" @click="onImageClick"></image>
				</view>
			</view>
		</template>
		<template v-else-if="list.length>=4">
			<view class="list-length-4">
				<image class="image" src="/static/img/bg1.jpg" @click="onImageClick"></image>
				<image class="image" src="/static/img/bg2.jpg" @click="onImageClick"></image>
			</view>
			<view class="list-length-4">
				<image class="image" src="/static/img/bg3.jpg" @click="onImageClick"></image>
				<image class="image" src="/static/img/bg4.jpg" @click="onImageClick"></image>
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
	$maxWidth: 160rpx;
	$splitWidth: 6rpx;
	$borderRadius: $uni-border-radius-sm;

	.split {
		margin-right: $splitWidth;
		margin-bottom: $splitWidth;
	}

	.list-length-1 {
		$width: $maxWidth;
		$height: $width;
		font-size: 0;

		.image {
			width: $width;
			height: $height;
			border-radius: $borderRadius;
			@extend .split;
		}
	}

	.list-length-2 {
		$width: $maxWidth/2 - $splitWidth/2;
		$height: $width;
		font-size: 0;

		.image {
			width: $width;
			height: $height * 2 - $splitWidth;
			border-radius: $borderRadius;
			@extend .split;
		}
	}

	.list-length-3 {
		display: flex;
		$width: $maxWidth/2 - $splitWidth/2;
		font-size: 0;

		.image {
			border-radius: $borderRadius;
			@extend .split;
		}

		.image1 {
			width: $width;
			height: $width*2;
		}

		.image2 {
			display: block;
			width: $width;
			height: $width - $splitWidth/2;
		}

		.image3 {
			display: block;
			width: $width;
			height: $width - $splitWidth/2;
		}
	}

	.list-length-4 {
		$width: $maxWidth/2 - $splitWidth/2;
		$height: $width;
		font-size: 0;

		.image {
			width: $width;
			height: $height;
			border-radius: $borderRadius;
			@extend .split;
		}
	}
</style>
