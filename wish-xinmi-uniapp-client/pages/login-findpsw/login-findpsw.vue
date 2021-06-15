<template>
	<view class="login">
		<uni-navbar title="用户协议"></uni-navbar>
		<view class="login-wrap">
			<!-- 邮箱登录（未登录系统将自动注册） -->
			<uni-forms :modelValue="formData" ref="form" border>
				<uni-forms-item label="邮箱" name="name">
					<uni-easyinput focus :inputBorder="false" type="text" placeholder="请输入邮箱"
						v-model="formData.email" />
				</uni-forms-item>
				<uni-forms-item label="验证码" name="vcode">
					<view class="v-code-box" style="">
						<uni-easyinput :inputBorder="false" type="text" placeholder="请输入验证码" v-model="formData.vcode" />
						<text v-if="!vcodeLock" class="v-code" :class="{'uni-color-primary': isValidEmail}"
							@click="onGetVCode">获取验证码</text>
						<text v-else style="margin-right: 5px;">{{restSeconds}}S</text>
					</view>
				</uni-forms-item>
				<uni-forms-item label="新密码" name="name">
					<uni-easyinput :inputBorder="false" type="text" placeholder="请设置密码" v-model="formData.email" />
				</uni-forms-item>
				<view class="uni-tip">
					<text>密码为6-20位数字字母组合 不能有空格</text>
				</view>

				<view style="margin-top: 30px;">
					<button class="uni-button" type="default" @click="submitForm">提交</button>
				</view>
			</uni-forms>
		</view>
	</view>
</template>

<script>
	const util = require('../../common/util.js')
	const VCODE_SECONDS = 60

	export default {
		data() {
			return {
				timer: 0,
				vcodeLock: false,
				restSeconds: VCODE_SECONDS,
				isValidEmail: false,
				loginType: 'email',

				// 邮箱方式
				formData: {
					name: '',
					age: '',
					hobby: []
				}
			}
		},
		methods: {
			submitForm(form) {
				// 手动提交表单
				this.$refs.form.validate().then((res) => {
					console.log('表单返回得值：', res)
				})
			},
			formSubmit: function(e) {
				console.log('form发生了submit事件，携带数据为：' + JSON.stringify(e.detail.value))
				var formdata = e.detail.value
				uni.showModal({
					content: '表单数据内容：' + JSON.stringify(formdata),
					showCancel: false
				})
			},
			formReset: function(e) {
				console.log('清空数据')
			},
			resetTimer() {
				this.vcodeLock = false
				clearInterval(this.timer)
				this.restSeconds = VCODE_SECONDS
			},
			onGetVCode() {
				if (this.vcodeLock) return

				this.vcodeLock = true
				this.timer = setInterval(() => {
					this.restSeconds--
					if (this.restSeconds === 0) {
						this.resetTimer()
					}
				}, 1000)

				this.fetchVcode().then(() => {
					uni.showToast({
						title: '已发送验证码',
					});
				}).catch(() => {
					this.resetTimer()
					uni.showToast({
						title: '发送失败',
					});
				}).finally(() => {

				})
			},
			fetchVcode() {
				return new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve()
					}, 2000)
				})
			},
			onEmailInput(e) {
				const value = e.detail.value
				this.isValidEmail = util.validEmail(value)
			},
			onLoginTypeClick() {
				this.loginType = this.loginType === 'email' ? 'password' : 'email'
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
	}

	.login {
		position: relative;
		height: 100%;
		padding: 0 50rpx;
	}

	.login-wrap {
		position: relative;
		height: 100%;
	}

	.logo-box {
		min-height: 150px;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
	}

	.v-code-input {
		flex: 1;
		padding-right: 10px;
	}

	.v-code {
		width: 80px;
		color: $uni-text-color-grey;
	}

	.v-code-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
