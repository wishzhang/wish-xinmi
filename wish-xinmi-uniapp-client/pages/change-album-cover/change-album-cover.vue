<template>
	<uni-index-layout>
		<uni-navbar title="更换相册封面"></uni-navbar>
		<u-cell-group>
			<u-cell-item  title="从手机相册选择" :arrow="true" @click="onChooseFromMobileAlbum"></u-cell-item>
		</u-cell-group>
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
			onChooseFromMobileAlbum() {
				const self = this
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed', 'original'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res1) {
						uni.showLoading()

						const file = res1.tempFiles[0]

						putFileForUniapp({
							file: file,
							success(res2) {
								let url = res2.data.link;

								const userInfo = JSON.parse(JSON.stringify(self.userInfo));
								userInfo.bgUrl = url;
								self.$store.commit('SET_USER_INFO', userInfo);

								const params = {
									userId: self.userInfo.userId,
									bgUrl: userInfo.bgUrl
								}
							    updateUserInfoRequest(params).then(res=>{
									uni.navigateBack()
									uni.hideLoading()
								})
							},
							fail() {
								self.$toast('操作失败')
							}
						})
					}
				})
			}
		}
	}
</script>

<style>

</style>
