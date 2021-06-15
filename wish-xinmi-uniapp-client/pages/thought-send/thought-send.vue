<template>
	<view>
		<uni-navbar :statusBar="true" left-icon="back">
			<template slot="right">
				<u-button class="publish-button" type="primary" :disabled="publishDisabled" @click="onPublish">发表
				</u-button>
			</template>
		</uni-navbar>

		<view class="uni-page-padding">
			<u-input class="thought-text" v-model="value" type="textarea" :border="false" placeholder="这一刻的想法"
				:clearable="false" auto-height />
			<u-upload :before-upload="onBeforeUpload" :upload-text="''"></u-upload>
		</view>
	</view>
</template>

<script>
	let files = [];
	export default {
		data() {
			return {
				value: ''
			}
		},
		computed: {
			publishDisabled() {
				return !(this.value.trim() || files.length > 0)
			}
		},
		methods: {
			onClickLeft() {
				uni.navigateBack({

				})
			},
			onPublish() {},
			onBeforeUpload(index, list) {
				files = list
				return false
			}
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
		min-height: 8em;
	}

	/deep/ .u-list-item {
		margin: 0 15rpx 15rpx 0;
	}
</style>
