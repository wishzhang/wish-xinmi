<template>
	<uni-index-layout>
		<uni-navbar title="通讯录" :is-back="false">
			<template slot="right">
				<uni-popover-add></uni-popover-add>
			</template>
		</uni-navbar>

		<uni-cell-group :border="false">
			<uni-cell-item title="新的朋友" :arrow="false" @click="onToContactConfirm">
				<template slot="icon">
						<uni-avatar class="avatar" icon-name="lianxiren3" custom-prefix="xinmi-icon" :icon-size="50"
							:bg-color="$style.uniColorWarning" size="small" :is-dot="true" 
							:count="contactWarnNumStr"></uni-avatar>
				</template>
			</uni-cell-item>
		</uni-cell-group>

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
			...mapGetters(['userInfo', 'contactWarnNumStr'])
		},
		onShow() {
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
