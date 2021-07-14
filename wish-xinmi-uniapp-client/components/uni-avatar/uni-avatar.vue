<template>
	<uni-badge :is-dot="isDot" :text="count+''" absolute="rightTop" :size="'small'" type="error">
		<view class="avatar-box" :style="{backgroundColor:bgColor, borderRadius: borderRadius}">
			<u-image class="avatar" :border-radius="borderRadius" :fade="false" :width="width" :height="height"
				:src="imageSrc" :show-error="showError" :bg-color="bgColor" @click="onClick">
			</u-image>
		
			<u-icon v-if="iconName" class="avatar-icon" :name="iconName" :custom-prefix="customPrefix"
				:size="iconSize" :color="iconColor"></u-icon>
		</view>
	</uni-badge>
</template>

<script>
	export default {
		name: "uni-avatar",
		inheritAttrs: false,
		props: {
			isDot: {
				type: Boolean,
				default: false
			},
			count: {
				type: String|Number,
				default: ''
			},
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
			},
			bgColor: {
				type: String
			},
			iconName: {
				type: String
			},
			iconSize: {
				type: Number
			},
			customPrefix: {
				type: String
			},
			iconColor: {
				type: String,
				default: 'white'
			}
		},
		data() {
			return {

			}
		},
		computed: {
			showError() {
				return this.iconName ? false : true
			},
			imageSrc() {
				if (!this.iconName) {
					return this.src || '/static/img/default-avatar.png'
				}
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

	.avatar-box {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.avatar-icon {
		position: absolute;

	}

	.avatar-badge {
		position: absolute;
		right: 0;
		top: 0;
	}
</style>
