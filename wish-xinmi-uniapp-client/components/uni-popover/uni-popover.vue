<template>
	<view>
		<view class="compos">
			<view class="base-btn" @click="show = !show">
				<slot></slot>
			</view>

			<view class="modal" :style="{ 
					height: show ?modalHeight: 0, 
					overflow: show ? '' : 'hidden', 
					width: this.width,
					top: modalTopPos,
					left: modalLeftPos
				}">
				<view class="modal-ang" v-if="dotShow && btnList.length > 0"
					:style="direction !== 'left' ? 'left: 10px': 'right: 10px'"></view>
				<view class="modal-item" v-for="(item, index) in btnList" :index="index" :key="index"
					@click="callRes(index)">
					<view class="item-text-box">
						<text>{{item}}</text>
					</view>
				</view>
			</view>
		</view>

		<view v-if="show" class="popover-layer" @click="show=false"></view>
	</view>
</template>

<script>
	/**
	 * :btnList				按钮列表
	 * :btnStyle			外部按钮样式
	 * :modalWidth			弹出层宽度
	 * :modalLeftPos		弹出层左定位
	 * :modalTopPos			弹出层顶定位
	 * :modalOpacity		弹出层透明度
	 * :direction			弹出层箭头位置 left right
	 * :active				默认激活状态
	 * @select				选中列表触发事件
	 * */


	export default {
		props:{
			active:{
				type:Boolean,
				default: false
			}
		},
		data() {
			return {
				show: this.active,
				dotShow: this.active
			}
		},
		computed: {
			width() {
				let str
				let num = ((Math.max(...this.btnList.map(el => el.length))) * 34)
				num = num + 30
				str = num + 'rpx'
				return str;
			},
			modalHeight() {
				return (this.btnList.length * 80) + 'rpx'
			}
		},
		watch: {
			show() {
				setTimeout(() => {
					this.dotShow = this.show
				}, 50);
			},
			active() {
				this.show = this.active
			}
		},
		props: {
			btnList: {
				type: Array,
				default: () => {
					return [];
				}
			},
			btnStyle: {
				type: Object,
				default: () => {
					return {};
				}
			},
			modalLeftPos: {
				type: String,
				default: '5vw'
			},
			modalTopPos: {
				type: String,
				default: '6vw'
			},
			modalOpacity: {
				type: String,
				default: '1'
			},
			direction: {
				type: String,
				default: 'left'
			}
		},
		methods: {
			callRes(e) {
				this.$emit('select', e);
				this.show = false;
				this.dotShow = false;
			}
		}
	};
</script>

<style scope lang="scss">
	.compos {
		position: relative;
		z-index: 10000;

		.modal {
			background-color: #4a4a4a;
			position: absolute;
			border-radius: 6rpx;
			z-index: 999;
			padding-left: 30rpx;

			.modal-item {
				display: flex;
				position: relative;
				z-index: 99;
				color: #fff;
				border-radius: 6rpx;
				overflow: hidden;

				.item-text-box {
					flex: 1;
					display: inline-block;
					border-bottom: 1px solid rgba(#999, 0.3);
					background-color: #4a4a4a;
					height: 80rpx;
					line-height: 80rpx;
				}
			}

			.modal-item:last-child {
				border-bottom: none;
			}

			.modal-ang {
				background-color: #4a4a4a;
				position: absolute;
				width: 9px;
				height: 9px;
				transform: rotate(45deg);
				top: -3px;
				border-radius: 3rpx;
			}
		}
	}

	.base-btn {
		position: relative;
		border: 0upx;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		box-sizing: border-box;
	}

	.popover-layer {
		position: fixed;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background-color: transparent;
		z-index: 9999;
	}
</style>
