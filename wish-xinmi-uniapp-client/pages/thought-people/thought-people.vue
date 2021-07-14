<template>
	<uni-index-layout class="uni-bg-white">
		<mescroll-body ref="mescrollRef" :down="downOption" :up="upOption" @init="mescrollInit" @up="upCallback">
			<uni-navbar></uni-navbar>

			<uni-user-thought-bg :height="400" :to-user="userDetail.userId" :name="userDetail.name"
				:bgSrc="userDetail.bgUrl" :avatarSrc="userDetail.avatarUrl" @bg-click="onUpdateBg" />

			<view class="thought-list">
				<view :key="name" class="thought-item-group" v-for="(groupItem, name) in group">
					<text class="year">{{name}}年</text>

					<view :key="item.thoughtId" class="thought-item u-border-bottom" v-for="item in groupItem">
						<view class="thought-item-left">
							<text class="day">{{item.createdAt|dateDay}}</text>
							<text class="month">{{item.createdAt|dateMonth}}月</text>
						</view>
						<view class="thought-item-right">
							<text class="text">{{item.content}}</text>
							<view class="media">
								<uni-gallery-four :list="item.photosUrl"></uni-gallery-four>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-body>

		<u-popup v-model="show" mode="bottom" border-radius="14">
			<view class="popup-item" @click="onChangeAlbumCover">
				更换相处封面
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
		fetchPeopleListRequest,
		fetchUserThoughtPageRequest
	} from "@/api/thought";
	import {
		fetchUserInfoRequest
	} from "@/api/user.js"
	import {
		fetchContactDetailRequest
	} from "@/api/contact"
	import {
		mapGetters
	} from 'vuex'
	import moment from 'moment'

	export default {
		mixins: [MescrollMixin],
		data() {
			return {
				userDetail: {},
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
			...mapGetters(['userInfo']),
			group() {
				const group = {};
				for (let item of this.list) {
					const mom = moment(item.createdAt);
					const year = mom.year();
					if (group[year]) {
						group[year].push(item);
					} else {
						group[year] = [item];
					}
				}
				return group;
			}
		},
		onLoad(option) {
			if (this.userInfo.userId !== option.userId) {
				const params1 = {
					userId: this.userInfo.userId,
					contactId: option.userId
				};
				fetchContactDetailRequest(params1).then(res => {
					if (res.code === 0) {
						this.userDetail = res.data;
					}
				});
			} else {
				this.userDetail = Object.assign({}, this.userInfo, {
					name: this.userInfo.username
				})
			}
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
				fetchUserThoughtPageRequest(params).then(res => {
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

<style scope scoped lang="scss">
	page {
		background-color: white;
	}

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

		.thought-item-group {
			.year {
				font-size: 50rpx;
				font-weight: bold;
				padding-left: $uni-padding-horizontal;
			}

			.thought-item {
				display: flex;
				padding: 28rpx $uni-padding-horizontal 14rpx;

				.thought-item-left {
					margin-right: 20rpx;

					.day {
						font-size: 50rpx;
						font-weight: bold;
						padding-right: 4rpx;
					}

					.month {
						font-size: $uni-font-size-base;
						font-weight: bold;
					}
				}

				.thought-item-right {
					flex: 1;
					padding: 0 0 10rpx 0;

					.text {
						display: block;
						padding: 20rpx 0 20rpx 0;
						background-color: $uni-bg-color-grey;
						margin-bottom: 20rpx;
					}

					.media {}
				}
			}
		}

	}
</style>
