<template>
	<view class="v-code">
		<text v-if="!vcodeLock" :class="{'uni-color-primary': isValid}" @click="onGetVCode">获取验证码</text>
		<text v-else style="margin-right: 5px;">{{restSeconds}}S</text>
	</view>
</template>

<script>
	const VCODE_SECONDS = 60

	export default {
		name: "button-vcode",
		props: {
			valid: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				timer: 0,
				vcodeLock: false,
				restSeconds: VCODE_SECONDS,
				loading: false
			}
		},
		computed: {
			isValid() {
				return !this.vcodeLock && this.valid
			}
		},
		methods: {
			resetTimer() {
				this.vcodeLock = false
				clearInterval(this.timer)
				this.restSeconds = VCODE_SECONDS
			},
			onGetVCode() {
				if (!(this.isValid && !this.loading)) return
				this.loading = true;
				
				uni.showLoading({
					title: '正在发送验证码'
				});

				this.fetchVcode().then(() => {
					this.vcodeLock = true
					this.timer = setInterval(() => {
						this.restSeconds--
						if (this.restSeconds === 0) {
							this.resetTimer()
						}
					}, 1000)
					uni.showToast({
						title: '已发送验证码',
					});
				}).catch(() => {
					this.resetTimer()
					uni.showToast({
						title: '发送失败',
					});
				}).finally(() => {
					this.loading = false;
					uni.hideLoading();
				})
			},
			fetchVcode() {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve()
					}, 2000)
				})
			},
		}
	}
</script>

<style lang="scss">
	.v-code {
		width: 180rpx;
		color: $uni-text-color-disable;
		text-align: right;
		padding-right: 8rpx;
	}
</style>
