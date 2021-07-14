<template>
	<uni-index-layout>
		<contact-people-friend v-if="contactDetail.contactStatus===3||option.userId===userInfo.userId" :contact-detail="contactDetail"></contact-people-friend>
		<contact-people-stranger v-else :contact-detail="contactDetail"></contact-people-stranger>
	</uni-index-layout>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		fetchContactDetailRequest
	} from '@/api/contact.js'
	import ContactPeopleFriend from './contact-people-friend.vue'
	import ContactPeopleStranger from './contact-people-stranger.vue'

	export default {
		components: {
			ContactPeopleFriend,
			ContactPeopleStranger
		},
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
