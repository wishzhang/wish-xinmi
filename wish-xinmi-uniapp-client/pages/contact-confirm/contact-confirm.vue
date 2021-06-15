<template>
	<view>
		<uni-navbar title="新的朋友"></uni-navbar>

		<uni-list :border="false">
			<template v-for="(item, index) in list">
				<uni-list-item :key="index" :title="item.name" :note="item.validateMsg">
					<view style="margin-right: 22rpx;" slot="header">
						<uni-avatar :src="item.avatarUrl"></uni-avatar>
					</view>
					<view class="right-class" slot="footer">
						<template v-if="item.status===2">
							<u-button type="primary" size="mini" :loading="acceptLoading" @click="onAccept(item)">接受
							</u-button>
						</template>
						<template v-else>
							<text class="u-tips-color">已添加</text>
						</template>
					</view>
				</uni-list-item>
			</template>
		</uni-list>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		fetchConfirmContactListRequest,
		confirmContactRequest
	} from '@/api/contact.js'

	export default {
		data() {
			return {
				list: [],
				acceptLoading: false
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad() {
			this.fetchData()
		},
		methods: {
			fetchData() {
				const params = {
					userId: this.userInfo.userId
				}
				fetchConfirmContactListRequest(params)
					.then(res => {
						this.list = res.data
					})
			},
			onAccept(item) {
				this.acceptLoading = true
				const params = {
					userId: this.userInfo.userId,
					contactId: item.contactId
				}
				confirmContactRequest(params)
					.then(() => {
						return this.fetchData()
					}).finally(() => {
						this.acceptLoading = false
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

	.right-class {
		position: relative;
		top: 20rpx;
	}
</style>
