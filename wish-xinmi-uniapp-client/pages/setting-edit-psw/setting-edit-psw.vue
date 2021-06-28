<template>
	<uni-index-layout>
		<uni-navbar title="修改密码"></uni-navbar>
		<view class="current-email">
			<text>当前绑定的邮箱是：</text>
			<text class="uni-color-primary">{{userInfo.emailAddress}}</text>
		</view>

		<view class="uni-page-padding uni-bg-white">

			<u-form :model="formData" ref="uForm" :label-width="140" :errorType="errorType">
				<u-form-item label="验证码" prop="vcode">
					<view class="v-code-box">
						<u-input :inputBorder="false" type="text" placeholder="请输入验证码" v-model="formData.vcode" />
						<uni-button-vcode :email-address="userInfo.emailAddress"></uni-button-vcode>
					</view>
				</u-form-item>
				<u-form-item focus label="新密码" prop="password">
					<u-input :inputBorder="false" type="password" placeholder="请输入密码" v-model="formData.password" />
				</u-form-item>
				</u-form-item>
				<u-form-item focus label="确认密码" prop="password2">
					<u-input :inputBorder="false" type="password" placeholder="请输入密码" v-model="formData.password2" />
				</u-form-item>
			</u-form>
		</view>

		<view class="uni-page-padding submit-button">
			<u-button type="primary" @click="submitForm">提交</u-button>
		</view>

		<view class="tip">
			<text>密码为6-20位数字字母组合 不能有空格</text>
		</view>
	</uni-index-layout>
</template>

<script>
	import UniButtonVcode from '@/components/uni-button-vcode/uni-button-vcode.vue'
	import util from '@/common/util.js'
	import {
		formUtil
	} from '@/common/util.js'
	import {
		findPasswordByEmailRequest
	} from "@/api/login"
	import {
		mapGetters
	} from 'vuex'
	import UniIndexLayout from '../../components/uni-index-layout/uni-index-layout'

	export default {
		components: {
			UniIndexLayout,
			UniButtonVcode
		},
		data() {
			return {
				errorType: formUtil.defaultErrorType,
				formData: {
					vcode: '',
					password: '',
					password2: ''
				},
				rules: {
					vcode: [{
						required: true,
						message: '请输入验证码',
						trigger: []
					}],
					password: [{
							required: true,
							message: '请输入密码',
							trigger: []
						},
						{
							validator: formUtil.validator.password,
							trigger: []
						}
					],
					password2: [{
						validator: (rules, value, callback) => {
							if (this.password !== this.password2) {
								callback('密码不一致')
							} else {
								callback()
							}
						},
						trigger: []
					}]
				}
			}
		},
		computed: {
			...mapGetters(['userInfo'])
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
							emailAddress: this.userInfo.emailAddress,
							verifyCode: this.formData.vcode,
							newPassword: this.formData.password
						}
						findPasswordByEmailRequest(params).then(res => {
							if (res.code === 0) {
								this.$toast('密码修改成功')
								uni.navigateBack()
							} else if (res.code === 2) {
								this.$toast('该邮箱未注册!')
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
	.current-email {
		margin: 15rpx $uni-padding-horizontal;
	}

	.v-code-box {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.tip {

		display: inline-block;
		margin: 40rpx $uni-padding-horizontal;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		text-align: left;
	}

	.tip-row {
		display: block;
		margin-bottom: 5 rpx;
	}

	.submit-button {
		margin-top: 50rpx;
	}
</style>
