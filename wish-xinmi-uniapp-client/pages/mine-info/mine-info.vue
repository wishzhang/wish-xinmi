<template>
	<uni-index-layout>
		<uni-navbar title="个人信息"></uni-navbar>
		<uni-list :border="false">
			<uni-list-item style="padding: 20rpx 0;" title="头像" link @click="onUpdateImage">
				<template slot="footer">
					<uni-avatar :src="userInfo.avatarUrl" size="large" :preview="true"></uni-avatar>
				</template>
			</uni-list-item>

			<uni-list-item title="00001">
			</uni-list-item>
		</uni-list>
	</uni-index-layout>
</template>

<script>
	import {
		putFileForUniapp
	} from "@/api/common"
	import {
		updateUserInfoRequest
	} from "@/api/user"
	import {
		mapGetters
	} from 'vuex'

	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			onUpdateImage() {
				const self = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res1) {
						uni.showLoading()

						const file = res1.tempFiles[0]

						putFileForUniapp({
							file: file,
							success(res2) {
								let url = res2.data.link;

								const userInfo = JSON.parse(JSON.stringify(self.userInfo));
								userInfo.avatarUrl = url;
								self.$store.commit('SET_USER_INFO', userInfo);

								const params = {
									userId: self.userInfo.userId,
									avatarUrl: userInfo.avatarUrl
								}
								updateUserInfoRequest(params)
							},
							fail() {
								self.$toast('更新失败')
							},
							complete() {
								uni.hideLoading()
							}
						})

					}
				})
			},
			onToContactConfirm() {
				uni.navigateTo({
					url: '/pages/contact-confirm/contact-confirm'
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
