<template>
	<uni-index-layout>
		<uni-navbar title="通讯录" :is-back="false">
			<template slot="right">
				<uni-popover-add></uni-popover-add>
			</template>
		</uni-navbar>

		<uni-cell-item title="新的朋友" :arrow="false" @click="onToContactConfirm">
			<template slot="icon">
				<u-icon name="lianxiren3" :size="50" custom-prefix="xinmi-icon" class="new-contact avatar"
					@click="onToContactConfirm"></u-icon>
			</template>
		</uni-cell-item>

		<u-index-list :scrollTop="scrollTop">
			<view v-for="(group, index) in list" :key="index">
				<template v-if="group.records.length>0">
					<u-index-anchor :index="group.label" />

					<uni-cell-group>
						<template v-for="(item, itemIndex) in group.records">
							<uni-cell-item :arrow="false" :title="item.name" :key="itemIndex"
								@click="onToContactPeople(item)">
								<template slot="icon">
									<uni-avatar class="avatar" size="small" :src="item.avatarUrl"></uni-avatar>
								</template>
							</uni-cell-item>
						</template>
					</uni-cell-group>
				</template>
			</view>
		</u-index-list>

		<u-tabbar :list="tabbar.list" :icon-size="tabbar.iconSize" :active-color="tabbar.activeColor"
			:height="tabbar.height" :inactive-color="tabbar.inactiveColor"></u-tabbar>
	</uni-index-layout>
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
			...mapGetters(['userInfo', 'tabbar'])
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
					url: '/pages/contact-people/contact-people',
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

	.avatar {
		margin-right: $uni-padding-horizontal;
	}

	.new-contact {
		$width: $uni-img-size-sm;

		display: flex;
		justify-content: center;
		align-items: center;
		width: $width;
		height: $width;
		color: white;
		background-color: $uni-color-warning;
		border-radius: $uni-border-radius-base;
	}
</style>
