<template>
	<u-cell-item :style="theItemStyle" class="uni-cell-item" :title="title" :title-style="itemTitleStyle"
		:hover-class="hoverClass" bg-color="white" :arrow="arrow" :value="value" :border-bottom="borderBottom"
		@click="onClick">

		<view v-if="$slots.icon|| icon" slot="icon" class="left-icon">
			<slot name="icon">
				<u-icon :custom-prefix="customPrefix?customPrefix:''" class="left-icon" :size="$style.uniImgSizeMini"
					:name="icon">
				</u-icon>
			</slot>
		</view>
		</view>

		<template slot="label">
			<slot name="label">{{label}}</slot>
		</template>

		<template slot="right-icon">
			<slot name="right-icon">
				<u-icon :size="32" :name="rightIcon"></u-icon>
			</slot>
		</template>
	</u-cell-item>
</template>

<script>
	export default {
		props: {
			itemStyle: {
				type: Object
			},
			to: {
				type: String
			},
			hoverClass: {
				type: String
			},
			customPrefix: {
				type: String
			},
			title: {
				type: String
			},
			titleStyle: {
				type: Object
			},
			label: {
				type: String
			},
			value: {
				type: String
			},
			icon: {
				type: String
			},
			rightIcon: {
				type: String
			},
			arrow: {
				type: Boolean,
				default: true
			},
			borderBottom: {
				type: Boolean,
				default: true
			},
			borderTop: {
				type: Boolean,
				default: false
			},
			groupBorder: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {

			}
		},
		computed: {
			itemTitleStyle() {
				let style = {}
				style = Object.assign({
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
	.left-icon {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.uni-cell-item.u-cell {
		display: flex;
		align-items: center;
		background: black;
		padding: 0 $uni-padding-horizontal;
		min-height: 106rpx;
		
		/deep/ .u-cell__value{
			font-size: $uni-font-size-base;
		}
	}
</style>
