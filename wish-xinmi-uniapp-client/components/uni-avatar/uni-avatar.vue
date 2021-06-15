<template>
	<u-image class="avatar" :fade="false" :width="width" :height="height" :src="src||defaultAvatar" @click="onToContactPeople">
	</u-image>
</template>

<script>
	export default {
		name: "uni-avatar",
		inheritAttrs: false,
		props: {
			src: {
				type: String
			},
			size: {
				type: String,
				default: 'default'
			}
		},
		data() {
			return {
				defaultAvatar: '/static/img/default-avatar.png'
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
		methods: {
			onToContactPeople() {
				uni.navigateTo({
					url: '/pages/contact-friend/contact-friend'
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
