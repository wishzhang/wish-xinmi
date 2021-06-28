<template>
	<u-image class="avatar" :fade="false" :width="width" :height="height" :src="imageSrc" @click="onClick">
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
				} else {
					this.$emit('click')
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.avatar {
		border-radius: 3px;
	}
</style>
