<template>
	<view class="uni-gallery-nine">
		<template v-if="list.length===1">
			<view class="list-length-1">
				<image class="image" key="fasd" :src="list[0]" @click="onImageClick(0)"></image>
			</view>
		</template>
		<template v-else-if="list.length===4">
			<view class="list-length-4">
				<image class="image" :src="list[0]" @click="onImageClick(0)"></image>
				<image class="image" :src="list[1]" @click="onImageClick(1)"></image>
			</view>
			<view class="list-length-4">
				<image class="image" :src="list[2]" @click="onImageClick(2)"></image>
				<image class="image" :src="list[3]" @click="onImageClick(3)"></image>
			</view>
		</template>
		<template v-else>
			<view class="list-lenght-9">
				<template v-for="(url,index) in list">
					<image class="image" :src="url" :key="index" @click="onImageClick(index)"></image>
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
				default () {
					return []
				}
			}
		},
		methods: {
			onImageClick(current) {
				uni.previewImage({
					current: current,
					urls: this.list,
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
