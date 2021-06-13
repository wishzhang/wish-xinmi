<template>
	<view class="login">
		<view class="login-wrap">
			<view class="logo-box">
				<text>信迷</text>
			</view>

			<!-- 邮箱登录（未登录系统将自动注册） -->
			<uni-forms :modelValue="formData" ref="form" border>
				<template v-if="loginType==='email'">
					<uni-forms-item label="邮箱" name="name">
						<uni-easyinput :inputBorder="false" type="text" placeholder="请输入邮箱" v-model="formData.email"
							@input="onEmailInput" />
					</uni-forms-item>
					<uni-forms-item label="验证码" name="vcode">
						<view class="v-code-box">
							<uni-easyinput :inputBorder="false" type="text" placeholder="请输入验证码"
								v-model="formData.vcode" />
							<uni-button-vcode :valid="isValidEmail"></uni-button-vcode>
						</view>
					</uni-forms-item>
				</template>

				<!-- 账号登录 -->
				<template v-else>
					<uni-forms-item label="账号" name="account">
						<uni-easyinput :inputBorder="false" type="text" placeholder="请输入账号"
							v-model="formData.account" />
					</uni-forms-item>
					<uni-forms-item label="密码" name="password">
						<view class="forget-psw-box">
							<uni-easyinput type="password" :inputBorder="false" placeholder="请输入密码"
								v-model="formData.vcode" />
							<text class="uni-color-primary forget-psw" @click="onGetVCode">忘记密码</text>
						</view>
					</uni-forms-item>
				</template>

				<view style="margin-top: 30px;">
					<button class="uni-button" type="default" @click="submitForm">登录</button>
				</view>

				<template v-if="loginType==='email'">
					<view class="login-email-tip">
						<text>未注册的邮箱验证通过后将自动注册</text>
					</view>
				</template>
			</uni-forms>

			<!-- 底部 -->
			<view class="login-bottom">
				<view class="uni-divider">上次登录方式</view>
				<view class="login-type-box">
					<view v-if="loginType!=='email'" class="iconfont iconyouxiang login-type-email"
						@click="onLoginTypeClick"></view>
					<view v-else class="iconfont iconsuo login-type-password" @click="onLoginTypeClick"></view>
				</view>

				<view class="agreement-box">
					<checkbox :color="'#c471ed'" class="agreement-checkbox" value="cb" checked="true" />
					登录表示同意<text class="agreement" @click="onAgreement">用户协议</text>和
					<text class="agreement" @click="onPolicy">隐私政策</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import UniButtonVcode from '@/components/uni-button-vcode/uni-button-vcode.vue'
	const util = require('../../common/util.js')

	export default {
		components: {
			UniButtonVcode
		},
		data() {
			return {
				isValidEmail: false,
				loginType: 'email',

				formData: {}
			}
		},
		methods: {
			onAgreement() {
				uni.navigateTo({
					url: '/pages/login-agreement/login-agreement'
				});
			},
			onPolicy() {
				uni.navigateTo({
					url: '/pages/login-policy/login-policy'
				});
			},
			submitForm(form) {
				// 手动提交表单
				this.$refs.form.validate().then((res) => {
					uni.switchTab({
						url: '/pages/msg/msg'
					})
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
			onEmailInput(val) {
				this.isValidEmail = util.validEmail(val)
			},
			onLoginTypeClick() {
				this.loginType = this.loginType === 'email' ? 'password' : 'email'
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color;
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

	.v-code-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.login-email-tip {
		margin-top: 20rpx;
		font-size: 13px;
		color: $uni-text-color-grey;
		text-align: center;
	}

	/* 底部 */

	.login-bottom {
		position: absolute;
		bottom: 100rpx;
		left: 0;
		right: 0;
	}

	/* 登录方式图标*/
	.login-type-box {
		margin-top: 8rpx;
		text-align: center;
		color: $uni-text-color-disable;
	}

	.login-type-email {
		font-size: 50rpx;
	}

	.login-type-password {
		font-size: 50rpx;
	}

	/* 协议 */
	.agreement-box {
		margin-top: 20rpx;
		text-align: center;
		color: $uni-text-color-grey;
	}

	.agreement {
		color: $uni-color-primary;
	}

	.agreement-checkbox {
		position: relative;
		top: -1px;
		transform: scale(0.7);
	}

	/* 忘记密码 */
	.forget-psw-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
