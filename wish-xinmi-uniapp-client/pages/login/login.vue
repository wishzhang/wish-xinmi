<template>
	<view class="login uni-bg-white uni-height-full">
		<view class="uni-status-bar"></view>
		<view class="login-main">
			<view class="logo-box">
				<u-image class="logo" :width="140" :height="140" :border-radius="10" :fade="false"
					src="/static/img/logo/xinmi_1024.png">
				</u-image>
			</view>

			<!-- 邮箱登录（未登录系统将自动注册） -->
			<u-form :model="formData" ref="uForm" :label-width="110" :errorType="errorType">

				<!-- 邮箱登录方式 -->
				<template v-if="curLoginType==='email'">
					<u-form-item label="邮箱" prop="email">
						<u-input :inputBorder="false" type="text" placeholder="请输入邮箱" v-model="formData.email" />
					</u-form-item>
					<u-form-item label="验证码" prop="vcode">
						<view class="v-code-box">
							<u-input :inputBorder="false" type="text" placeholder="请输入验证码" v-model="formData.vcode" />
							<uni-button-vcode :emailAddress="formData.email"></uni-button-vcode>
						</view>
					</u-form-item>
				</template>

				<!-- 信迷号登录方式 -->
				<template v-else>
					<u-form-item label="信迷号" prop="account">
						<u-input :inputBorder="false" type="text" placeholder="请输入信迷号" v-model="formData.account" />
					</u-form-item>
					<u-form-item label="密码" prop="password">
						<view class="forget-psw-box">
							<u-input class="psw-input" type="password" :inputBorder="false" placeholder="请输入密码"
								v-model="formData.password" />
							<text class="uni-color-primary forget-psw" @click="onToLoginFindPsw">忘记密码</text>
						</view>
					</u-form-item>
				</template>

				<view style="margin-top: 30px;">
					<u-button type="primary" @click="submitForm">登录</u-button>
				</view>

				<template v-if="curLoginType==='email'">
					<view class="login-email-tip">
						<text>未注册的邮箱验证通过后将自动注册</text>
					</view>
				</template>
			</u-form>
		</view>


		<view class="login-bottom" v-if="showBottom">
			<u-divider :half-width="'50%'">上次登录方式</u-divider>
			<!-- <view class="uni-divider">上次登录方式</view> -->
			<view class="login-type-box">
				<u-icon v-if="curLoginType!=='email'" name="youxiang" custom-prefix="xinmi-icon"
					class="login-type-email" @click="oncurLoginTypeClick"></u-icon>

				<u-icon v-else class="login-type-password" name="suo" custom-prefix="xinmi-icon"
					@click="oncurLoginTypeClick"></u-icon>

			</view>

			<view class="agreement-box">
				<u-checkbox :size="$style.uniFontSizeSm" class="agreement-checkbox" v-model="isAgree">
					登录表示同意<text class="agreement" @click="onAgreement">用户协议</text>和
					<text class="agreement" @click="onPolicy">隐私政策</text>
				</u-checkbox>
			</view>
		</view>
	</view>
</template>

<script>
	import UniButtonVcode from '@/components/uni-button-vcode/uni-button-vcode.vue'
	import {
		mapGetters
	} from 'vuex'
	import {
		validEmail,
		showContactWarnNum
	} from '@/common/util.js'
	import {
		loginByPasswordRequest,
		loginByEmailRequest
	} from '@/api/login.js'

	export default {
		components: {
			UniButtonVcode
		},
		data() {
			return {
				// hack 使底部不随键盘移动
				showBottom: true,

				// 是否统一登录协议
				isAgree: true,
				// 当前使用的登录方式
				curLoginType: 'email',

				errorType: ['border-bottom', 'toast'],
				formData: {
					account: '',
					password: ''
				},
				rules: {
					email: [{
						required: true,
						message: '请输入邮箱',
						trigger: ['change', 'blur'],
					}],
					vcode: [],
					/**
					 * 信迷号方式验证
					 */
					account: [{
						required: true,
						message: '请输入信迷号',
						trigger: ['change', 'blur'],
					}],
					password: [{
						required: true,
						message: '请输入密码',
						trigger: []
					}]
				}
			}
		},
		computed: {
			...mapGetters(['loginType'])
		},
		watch: {
		},
		created() {
			this.curLoginType = this.loginType

		},
		mounted() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			// 跳转到忘记密码页面
			onToLoginFindPsw() {
				uni.navigateTo({
					url: '/pages/login-findpsw/login-findpsw'
				})
			},
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
			// 登录
			submitForm() {
				if (!this.isAgree) {
					this.$toast('请阅读并勾选下方协议')
					return
				}

				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading({
							title: '正在登录...'
						});

						this.loginRequest().then(res => {
							const userInfo = res.data
							this.$store.commit('SET_TOKEN', userInfo.token)
							this.$store.commit('SET_USER_INFO', userInfo)

							this.$store.dispatch('FetchContactWarnNum')
							this.$store.dispatch('FetchMineAllChatList')

							uni.switchTab({
								url: '/pages/msg/msg'
							})
						}).catch(err => {
							this.$toast('登录失败')
						}).finally(() => {
							uni.hideLoading()
						})
					}
				})
			},
			loginRequest() {
				if (this.curLoginType === 'password') {
					const params = {
						username: this.formData.account,
						password: this.formData.password
					}
					return loginByPasswordRequest(params)
				} else {
					const params = {
						emailAddress: this.formData.email,
						verifyCode: this.formData.vcode
					}
					return loginByEmailRequest(params)
				}
			},
			// 切换登录方式
			oncurLoginTypeClick() {
				this.formData = {}
				this.curLoginType = this.curLoginType === 'email' ? 'password' : 'email'
				this.$store.commit('SET_LOGIN_TYPE', this.curLoginType)
			}
		}
	}
</script>

<style scoped lang="scss">
	.login {
		position: relative;
		height: 100%;
		padding: 0 60rpx;
		min-height: 1200rpx;

		.login-main {
			overflow: hidden;

			.logo-box {
				display: flex;
				justify-content: center;
				align-items: center;

				.logo {
					margin-top: 120rpx;
					margin-bottom: 60rpx;
				}
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
				color: $uni-tips-color;
				text-align: center;
			}
		}



		/* 底部 */

		.login-bottom {
			position: absolute;
			z-index: 0;
			margin-top: 60rpx;
			bottom: 20rpx;
			left: 0;
			right: 0;
		}

		/* 登录方式图标*/
		.login-type-box {
			margin-top: 8rpx;
			text-align: center;
			color: $uni-light-color;
		}

		.login-type-email {
			font-size: 44rpx;
		}

		.login-type-password {
			font-size: 44rpx;
		}

		/* 协议 */
		.agreement-box {
			margin-top: 10rpx;
			text-align: center;
			color: $uni-tips-color;
		}

		.agreement {
			color: $uni-color-primary;
		}

		.agreement-checkbox {}

		/* 忘记密码 */
		.forget-psw-box {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.psw-input {
				flex: 1;
			}

			.forget-psw {
				display: block;
				width: 140rpx;
				text-align: right;
				padding-right: $uni-border-radius-base;
			}

		}
	}
</style>
