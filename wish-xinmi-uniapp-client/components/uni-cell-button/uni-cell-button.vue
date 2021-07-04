<template>
	<u-cell-item :style="theItemStyle" class="uni-cell-item" bg-color="white" :arrow="false"
		:title-style="itemTitleStyle" :border-bottom="borderBottom" @click="onClick">
		<template slot="title">
			<view class="title-box">
				<u-icon v-if="iconName" class="icon" :size="theIconSize" :name="iconName"
					:style="{marginRight: theGutter}" :customPrefix="customPrefix"></u-icon>
				<text>{{title}}</text>
			</view>
		</template>
	</u-cell-item>
</template>

<script>
	export default {
		props: {
			iconSize: {
				type: Number
			},
			iconName: {
				type: String
			},
			gutter: {
				type: Number
			},
			title: {
				type: String
			},
			to: {
				type: String
			},
			customPrefix: {
				type: String
			},
			borderBottom: {
				type: Boolean,
				default: true
			},
			borderTop: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				theIconSize: this.iconSize || this.$style.uniImgSizeMini,
				theGutter: this.gutter || this.$style.uniSpacingColSm
			}
		},
		computed: {
			itemTitleStyle() {
				let style = {}
				style = Object.assign({
					width: '100%',
					fontSize: this.$style.uniFontSizeBase
				}, this.titleStyle)
				return style
			},
			theItemStyle() {
				let style = {}
				style = Object.assign(style, this.itemStyle)
				return style
			}
		},
		methods: {
			onClick() {
				if (this.to) {
					this.$navigateTo({
						url: this.to
					})
				} else {
					this.$emit('click')
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	.title-box {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: $uni-color-primary;
	}

	.uni-cell-item.u-cell {
		display: flex;
		align-items: center;
		padding: 0 $uni-padding-horizontal;
		height: 106rpx;
		line-height: 106rpx;
	}
</style>
