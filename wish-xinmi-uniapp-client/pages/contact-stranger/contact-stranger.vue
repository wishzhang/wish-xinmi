<template>
	<view>
		<uni-navbar :borderBottom="false"></uni-navbar>

		<uni-list :border="false">
			<uni-list-item :title="contactDetail.name" :note="'信迷号:'+contactDetail.username">
				<template slot="header">
					<uni-avatar :src="contactDetail.avatarUrl" style="margin-right: 22rpx;"></uni-avatar>
				</template>
			</uni-list-item>

			<uni-list-item title="朋友圈" link clickable @click="onToThoughtPeople"></uni-list-item>
		</uni-list>

		<template v-if="status===null">
			<view class="contact-button uni-color-primary" type="default" plain @click="onAddContact">添加到联系人</view>
		</template>
		<template v-if="status===1">
			<view class="contact-button uni-color-primary-disabled" type="default" plain>已发送验证请求</view>
		</template>

	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		fetchContactDetailRequest,
		fetchUserContactStatusRequest,
		addContactRequest
	} from '@/api/contact.js'

	export default {
		data() {
			return {
				option: {},
				contactDetail: {},
				status: null
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad(option) {
			this.option = option
			const params = {
				userId: this.userInfo.userId,
				contactId: this.option.userId
			}

			fetchContactDetailRequest(params).then(res => {
				this.contactDetail = res.data
			})

			this.fetchStatus()
		},
		methods: {
			fetchStatus() {
				const params = {
					userId: this.userInfo.userId,
					contactId: this.option.userId
				}
				return fetchUserContactStatusRequest(params).then(res => {
					this.status = res.data
				})
			},
			onToContactConfirm() {
				uni.navigateTo({
					url: '/pages/contact-confirm/contact-confirm'
				})
			},
			onToChat() {
				uni.navigateTo({
					url: '/pages/chat/chat'
				})
			},
			onToThoughtPeople() {
				uni.navigateTo({
					url: '/pages/thought-people/thought-people'
				})
			},
			onAddContact() {
				uni.showLoading()
				const params = {
					userId: this.userInfo.userId,
					contactId: this.option.userId
				}
				addContactRequest(params).then(() => {
					return this.fetchStatus()
				}).finally(() => {
					uni.hideLoading()
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

	/deep/ .uni-list-item__content-title {
		margin: auto 0;
	}

	/* 按钮 */

	.contact-button {
		margin-top: 30rpx;
		padding: 30rpx 0;
		text-align: center;
		background-color: white;
	}
</style>
