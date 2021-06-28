<template>
	<u-navbar :title="title" 
	:is-back="isBack" :back-text="backText" :title-bold="true" :title-size="34"
		:border-bottom="borderBottom" back-icon-name="arrow-left" :height="47" :back-icon-color="$style.uniMainColor"
		:back-icon-size="39" :back-text-style="{color:$style.uniMainColor}" :title-color="$style.uniMainColor">
		<view class="uni-page-padding" slot="right">
			<slot name="right"></slot>
		</view>
	</u-navbar>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			},
			isBack: {
				type: Boolean,
				default: true
			},
			backText: {
				type: String,
				default: ''
			},
			borderBottom: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {}
		},
		methods: {
			toChatClick() {
				uni.navigateTo({
					url: '/pages/chat/chat'
				})
			}
		}
	}
</script>

<style>

</style>
