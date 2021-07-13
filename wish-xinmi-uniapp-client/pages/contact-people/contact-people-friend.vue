<template>
	<uni-index-layout>
		<uni-navbar></uni-navbar>

		<uni-cell-group :border="false">
			<uni-cell-item :arrow="false" :item-style="{paddingTop: '60rpx', paddingBottom: '60rpx'}"
				:hover-class="'none'" :title="contactDetail.name" :label="'信迷号:'+contactDetail.username">
				<template slot="icon">
					<uni-avatar :src="contactDetail.avatarUrl" :preview="true" :style="{marginRight: $style.uniPaddingHorizontal}">
					</uni-avatar>
				</template>
			</uni-cell-item>

			<uni-cell-item title="朋友圈" @click="onToThoughtPeople"></uni-cell-item>
		</uni-cell-group>

		<uni-cell-group>
			<uni-cell-button style="margin-top: 60rpx;" icon-name="chat" title='发消息' @click="onToChat">
			</uni-cell-button>
		</uni-cell-group>
	</uni-index-layout>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		fetchContactDetailRequest
	} from '@/api/contact.js'
	export default {
		props: ['contactDetail'],
		data() {
			return {
				option: {},
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad(option) {
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
				this.$navigateTo({
					url: '/pages/thought-people/thought-people',
					params: {
						userId: this.contactDetail.userId
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

	/deep/ .uni-list-item__content-title {
		margin: auto 0;
	}
</style>
