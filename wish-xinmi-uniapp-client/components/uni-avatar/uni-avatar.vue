<template>
	<u-image class="avatar" :border-radius="borderRadius" :fade="false" :width="width" :height="height" :src="imageSrc"
		@click="onClick">
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
			},
			preview: {
				type: Boolean,
				default: false
			},
			toUser: {
				type: String
			}
		},
		data() {
			return {}
		},
		computed: {
			imageSrc() {
				return this.src || '/static/img/default-avatar.png'
			},
			width() {
				if (this.size === 'default' || !this.size) {
					return this.$style.uniImgSizeBase
				} else if (this.size === 'small') {
					return this.$style.uniImgSizeSm
				} else if (this.size === 'large') {
					return this.$style.uniImgSizeLg
				}
			},
			height() {
				const w = (Number.parseInt(this.width) + 2) + 'rpx'
				return w
			},
			borderRadius() {
				if (this.size === 'default' || !this.size) {
					return this.$style.uniBorderRadiusBase
				} else if (this.size === 'small') {
					return this.$style.uniBorderRadiusSm
				} else if (this.size === 'large') {
					return this.$style.uniBorderRadiusLg
				}
			},
			style() {

			}
		},
		methods: {
			onClick() {
				if (this.preview) {
					uni.previewImage({
						urls: [this.imageSrc],
						fail() {
							uni.showToast({
								title: '预览图片失败',
								icon: 'none'
							})
						}
					})
				} else if (this.toUser) {
					this.$navigateTo({
						url: '/pages/contact-people/contact-people',
						params: {
							userId: this.toUser
						}
					})
				} else {
					this.$emit('click')
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.avatar {
		border-radius: 3rpx;
	}
</style>
