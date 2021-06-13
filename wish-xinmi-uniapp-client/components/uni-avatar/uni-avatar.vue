<template>
	<u-image class="avatar" :width="width" :height="height" :src="src" @click="onToContactPeople"></u-image>
</template>

<script>
	export default {
		name: "uni-avatar",
		inheritAttrs: false,
		props: {
			src: {
				type: String,
				default: '/static/img/default-avatar.png'
			},
			size: {
				type: String,
				default: 'default'
			}
		},
		data() {
			return {

			}
		},
		computed: {
			width() {
				if (this.size === 'default' || !this.size) {
					return 86;
				} else if (this.size === 'large') {
					return 130;
				}
			},
			height() {
				return this.width;
			},
			style() {

			}
		},
		methods:{
			onToContactPeople(){
				uni.navigateTo({
					url: '/pages/contact-people/contact-people'
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.avatar {
		border-radius: 3px;
	}
</style>
