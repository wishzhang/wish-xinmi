<template>
	<view>
		<uni-navbar title="通讯录" :is-back="false">
			<template slot="right">
				<uni-popover-add></uni-popover-add>
			</template>
		</uni-navbar>
		<uni-list :border="true">
			<!-- 显示圆形头像 -->
			<uni-list-item title="新的朋友" clickable @click="onToContactConfirm">
				<template slot="header">
					<view class="iconfont iconlianxiren3 new-contact"></view>
				</template>
			</uni-list-item>
		</uni-list>

		<u-index-list :scrollTop="scrollTop">
			<view v-for="(group, index) in list" :key="index">
				<template v-if="group.records.length>0">
					<u-index-anchor :index="group.label" />
					<view v-for="(item, itemIndex) in group.records" class="list-cell">
						<uni-list :key="item.contactId" :border="false">
							<uni-list-item :title="item.name" clickable @click="onToContactPeople(item)">
								<view style="margin-right: 22rpx;" slot="header">
									<uni-avatar :src="item.avatarUrl"></uni-avatar>
								</view>
							</uni-list-item>
						</uni-list>
					</view>
				</template>
			</view>
		</u-index-list>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		fetchYetContactListRequest
	} from '@/api/contact.js'

	export default {
		data() {
			return {
				list: [],
				scrollTop: 0,
				indexList: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S",
					"T", "U",
					"V", "W", "X", "Y", "Z"
				]
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad() {
			const params = {
				userId: this.userInfo.userId
			}
			fetchYetContactListRequest(params).then(res => {
				this.list = res.data
			})
		},
		methods: {
			onPageScroll(e) {
				this.scrollTop = e.scrollTop
			},
			onToContactConfirm() {
				uni.navigateTo({
					url: '/pages/contact-confirm/contact-confirm'
				})
			},
			onToContactPeople(item) {
				this.$navigateTo({
					url: '/pages/contact-friend/contact-friend',
					params: {
						userId: item.contactId
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	page {
		height: 100%;
	}

	.group-title {
		background-color: $uni-bg-color-grey !important;
		padding-top: 10rpx !important;
		padding-bottom: 10rpx !important;
	}

	/deep/ {
		.uni-list-item__content-title,
		.uni-list-chat__content-title {
			position: relative;
			top: 24rpx;
		}
	}

	.new-contact {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 86rpx;
		height: 86rpx;
		color: white;
		background-color: #07C160;
		border-radius: $uni-border-radius-base;
		font-size: 64rpx;
		margin-right: 22rpx;
	}
</style>
