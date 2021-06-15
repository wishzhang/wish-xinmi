<template>
	<view>
		<uni-navbar back-text="000001"></uni-navbar>

		<uni-list :border="false">
			<uni-list-item :title="contactDetail.name" :note="'信迷号:'+contactDetail.username">
				<template slot="header">
					<uni-avatar :src="contactDetail.avatarUrl" style="margin-right: 22rpx;"></uni-avatar>
				</template>
			</uni-list-item>

			<uni-list-item title="朋友圈" link clickable @click="onToThoughtPeople"></uni-list-item>
		</uni-list>
		<u-button style="margin-top: 60rpx;" type="default" @click="onToChat">发消息</u-button>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		fetchContactDetailRequest
	} from '@/api/contact.js'
	export default {
		data() {
			return {
				option: {},
				contactDetail: {}
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
		},
		methods: {
			onToContactConfirm() {
				uni.navigateTo({
					url: '/pages/contact-confirm/contact-confirm'
				})
			},
			onToChat() {
				this.$navigateTo({
					url: '/pages/chat/chat',
					params: {
						userId: this.contactDetail.userId
					}
				})
			},
			onToThoughtPeople() {
				uni.navigateTo({
					url: '/pages/thought-people/thought-people'
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
</style>
