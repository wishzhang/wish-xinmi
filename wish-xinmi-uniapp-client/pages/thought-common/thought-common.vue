<template>
	<uni-index-layout class="uni-bg-white">
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @up="upCallback">
			<uni-navbar title="朋友圈">
				<template slot="right">
					<uni-icons type="camera-filled" size="22" :color="$style.uniColorPrimary"
						@click="onToThoughtSendPage">
					</uni-icons>
				</template>
			</uni-navbar>

			<uni-user-thought-bg :name="userInfo.username" :bgSrc="userInfo.bgUrl" :avatarSrc="userInfo.avatarUrl"
				:to-user="userInfo.userId" @bg-click="onUpdateBg" />

			<view class="thought-list">
				<view :key="item.thoughtId" class="thought-item u-border-bottom" v-for="(item,index) in list">
					<view class="thought-item-left">
						<uni-avatar :src="item.avatarUrl" :to-user="item.createUser"></uni-avatar>
					</view>
					<view class="thought-item-right">
						<text class="name">{{item.name}}</text>
						<text class="text">{{item.content}}</text>
						<view class="media">
							<uni-gallery-nine :list="item.photosUrl"></uni-gallery-nine>
						</view>
						<text class="time">{{item.createdAt}}</text>
					</view>
				</view>
			</view>
		</mescroll-body>

		<u-popup v-model="show" mode="bottom" border-radius="14">
			<view class="popup-item" @click="onChangeAlbumCover">
				更换相册封面
			</view>
			<view class="uni-bg-color popup-item-split"></view>
			<view class="popup-item" @click="show=false">
				取消
			</view>
		</u-popup>
	</uni-index-layout>
</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
	import {
		apiGoods
	} from "@/api/mock.js"
	import {
		fetchPageRequest,
	} from "@/api/thought";
	import {
		mapGetters
	} from 'vuex'

	export default {
		mixins: [MescrollMixin],
		components: {

		},
		data() {
			return {
				show: false,

				loading: false,
				list: [],
				downOption: {
					use: false
				},
				upOption: {
					noMoreSize: 0,
					page: {
						size: 10
					}
				}
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onShow(){
			this.list = []
			this.mescroll && this.mescroll.resetUpScroll() 
		},
		methods: {
			onChangeAlbumCover() {
				this.show = false
				this.$navigateTo({
					url: '/pages/change-album-cover/change-album-cover'
				})
			},
			onUpdateBg() {
				this.show = true
			},
			onClickLeft() {
				uni.navigateBack()
			},
			onToThoughtSendPage() {
				uni.navigateTo({
					url: '/pages/thought-send/thought-send'
				})
			},
			upCallback(page) {
				const self = this
				const params = {
					userId: this.userInfo.userId,
					current: page.num,
					size: page.size
				}
				fetchPageRequest(params).then(res => {
					if (res.code === 0) {
						const data = res.data
						data.records = data.records.map(el => {
							el.photosUrl = el.photosUrl && el.photosUrl.split(',') || []
							return el
						})

						self.mescroll.endBySize(data.records.length, data.total)

						if (page.num === 1) {
							this.list = []
						}
						this.list = this.list.concat(data.records)
					}
				}).catch(() => {
					this.mescroll.endErr()
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	/* 弹出层 */
	.popup-item {
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		background-color: white;
	}

	.popup-item-split {
		height: 10rpx;
		background-color: $uni-bg-color;
	}

	.thought-list {
		padding-top: 120rpx;
		background-color: white;

		.thought-item {
			display: flex;
			padding: 28rpx $uni-padding-horizontal 14rpx;

			.thought-item-left {
				margin-right: 20rpx;
			}

			.thought-item-right {
				flex: 1;
				padding: 0rpx 0 10rpx;

				.name {
					display: block;
					font-weight: 700;
					font-family: PingFangSC-Regular;
					color: #008b8b;
				}

				.text {
					display: block;
					padding: 10rpx 0 20rpx 0;
				}

				.media {}

				.time {
					display: block;
					margin-top: 14rpx;
					font-size: $uni-font-size-xs;
					color: $uni-tips-color;
				}
			}
		}
	}
</style>
