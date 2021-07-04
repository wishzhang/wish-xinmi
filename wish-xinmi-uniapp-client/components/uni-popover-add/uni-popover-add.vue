<template>
	<uni-popover :show="show" modalLeftPos="-120rpx" 
	modalTopPos="54rpx" direction="left" :btn-list="btnList" @select="onSelect">
		<u-icon :size="$style.uniImgSizeMini" custom-prefix="xinmi-icon" name="add"></u-icon>
	</uni-popover>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				btnList: ['添加朋友']
			}
		},
		methods: {
			onSelect(index) {
				uni.navigateTo({
					url: '/pages/contact-add/contact-add'
				})
			}
		}
	}
</script>

<style>
</style>
