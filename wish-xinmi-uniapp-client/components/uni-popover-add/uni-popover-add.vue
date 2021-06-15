<template>
	<uni-popover modalLeftPos="-120rpx" modalTopPos="54rpx" direction="left" :btn-list="btnList" @select="onSelect">
		<u-icon :size="44" name="plus-circle"></u-icon>
	</uni-popover>
</template>

<script>
	export default {
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
