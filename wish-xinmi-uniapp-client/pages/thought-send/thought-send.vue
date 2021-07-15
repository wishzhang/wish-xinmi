<template>
	<uni-index-layout class="uni-bg-white">
		<uni-navbar :statusBar="true" left-icon="back" background="white">
			<template slot="right">
				<u-button class="publish-button" type="primary" :disabled="publishDisabled" @click.native="onPublish">发表
				</u-button>
			</template>
		</uni-navbar>

		<view class="uni-page-padding">
			<u-input class="thought-text" v-model="value" type="textarea" :border="false" placeholder="这一刻的想法" focus
				:height="200" :clearable="false" :auto-height="true" />
			<u-upload ref="uUpload" :upload-text="''" :auto-upload="false" action="http://uploasd"></u-upload>
		</view>
	</uni-index-layout>
</template>

<script>
	import {
		addThoughtForUniappRequest
	} from '@/api/thought.js'
	import {
		mapGetters
	} from 'vuex'

	export default {
		data() {
			return {
				value: '',
				lists: []
			}
		},
		computed: {
			...mapGetters(['userInfo']),
			publishDisabled() {
				return !(this.value.trim() && this.lists.length > 0)
			}
		},
		methods: {
			onClickLeft() {
				uni.navigateBack()
			},
			onPublish() {
				uni.showLoading()
				const files = this.lists.map((el, index) => {
					return {
						name: `file${index}`,
						file: el.file,
						uri: el.file.path
					}
				})
				addThoughtForUniappRequest({
					content: this.value,
					files: files,
					createUser: this.userInfo.userId,
					success: () => {
						this.$toast('发表成功')
						uni.navigateBack()
					},
					fail: (err) => {
						console.log(err)
						this.$toast('发表失败')
					},
					complete: () => {
						uni.hideLoading()
					}
				})
			},
			onReady() {
				this.lists = this.$refs.uUpload.lists
			},
		}
	}
</script>

<style scoped lang="scss">
	page {
		background-color: white;
	}

	.publish-button {
		width: 100rpx;
		height: 54rpx;
		line-height: 54rpx;
		font-size: $uni-font-size-sm;
		text-align: center;
		border-radius: $uni-border-radius-base;
	}

	.thought-text {
		display: block;
		margin-top: 6rpx;
	}

	/deep/ .u-list-item {
		margin: 0 15rpx 15rpx 0;
	}
</style>
