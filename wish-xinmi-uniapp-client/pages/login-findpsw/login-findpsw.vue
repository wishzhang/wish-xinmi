<template>
	<view>
		<uni-navbar title="找回密码"></uni-navbar>
		<view class="uni-page-padding uni-bg-white">
			<u-form :model="formData" ref="uForm" :label-width="110" :errorType="errorType">
				<u-form-item label="邮箱" prop="email">
					<u-input focus :inputBorder="false" type="text" placeholder="请输入邮箱" v-model="formData.email" />
				</u-form-item>

				<u-form-item label="验证码" prop="vcode">
					<view class="v-code-box">
						<u-input :inputBorder="false" type="text" placeholder="请输入验证码" v-model="formData.vcode" />
						<uni-button-vcode :email-address="formData.email"></uni-button-vcode>
					</view>
				</u-form-item>

				<u-form-item label="新密码" prop="newPassword">
					<u-input :inputBorder="false" type="password" placeholder="请设置密码" v-model="formData.newPassword" />
				</u-form-item>

				<view class="uni-tip">
					<text>密码为6-20位数字字母组合 不能有空格</text>
				</view>
			</u-form>
		</view>

		<view class="uni-page-padding submit-button">
			<u-button type="primary" @click="submitForm">提交</u-button>
		</view>
	</view>
</template>

<script>
	import {
		validEmail,
		formUtil
	} from '@/common/util.js'
	import {
		findPasswordByEmailRequest
	} from '@/api/login.js'

	export default {
		data() {
			return {
				errorType: formUtil.defaultErrorType,

				formData: {
					email: '',
					vcode: '',
					newPassword: ''
				},

				rules: {
					email: [{
							required: true,
							message: '请输入邮箱',
							trigger: ['change'],
						},
						{
							validator: formUtil.validator.emailAddress,
							trigger: ['blur']
						}
					],
					vcode: [{
						required: true,
						message: '请输入验证码',
						trigger: []
					}],
					newPassword: [{
							required: true,
							message: '请输入密码',
							trigger: []
						},
						{
							validator: formUtil.validator.password,
							trigger: []
						}
					]
				}
			}
		},
		mounted() {
			this.$refs.uForm.setRules(this.rules)
		},
		methods: {
			submitForm() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						uni.showLoading()

						const params = {
							emailAddress: this.formData.email,
							verifyCode: this.formData.vcode,
							newPassword: this.formData.newPassword
						}
						findPasswordByEmailRequest(params).then(res => {
							if (res.code === 0) {
								this.$toast('修改成功')
								history.back();
							} else if (res.code === 1) {
								this.$toast('邮箱未注册')
							} else if (res.code === 2) {
								this.$toast('验证码错误')
							}
						}).finally(() => {
							uni.hideLoading()
						})
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.v-code-box {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.uni-tip {
		display: inline-block;
		margin: 20rpx 0 30rpx 0;
		color: $uni-tips-color;
		font-size: $uni-font-size-sm;
	}

	.submit-button {
		margin-top: 60rpx;
	}
</style>
