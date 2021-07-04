<template>
	<uni-index-layout>
		<uni-navbar title="绑定邮箱修改" background="white"></uni-navbar>
		<view class="current-email">
			<text>您之前绑定的邮箱是：</text><text class="uni-color-primary">{{userInfo.emailAddress}}</text>
		</view>

		<view class="uni-page-padding uni-bg-white">
			<u-form :model="formData" ref="uForm" :label-width="110" :errorType="errorType">
				<u-form-item focus label="密码" prop="password">
					<u-input focus :inputBorder="false" type="password" placeholder="请输入密码" v-model="formData.password" />
				</u-form-item>
				<u-form-item label="邮箱" prop="email">
					<u-input :inputBorder="false" type="text" placeholder="请输入新邮箱" v-model="formData.email" />
				</u-form-item>
				<u-form-item label="验证码" prop="vcode">
					<view class="v-code-box">
						<u-input :inputBorder="false" type="text" placeholder="请输入验证码" v-model="formData.vcode" />
						<uni-button-vcode :email-address="formData.email"></uni-button-vcode>
					</view>
				</u-form-item>
			</u-form>
		</view>

		<view class="uni-page-padding submit-button">
			<u-button type="primary" @click="submitForm">提交</u-button>
		</view>
		
		<view class="uni-page-padding tip">
			<text class="tip-row">如果没有收到邮件，可以尝试：</text>
			<text class="tip-row">1. 在广告垃圾邮件中找找看</text>
			<text class="tip-row">2. 点击重新发送</text>
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
		editEmailAddressRequest
	} from "@/api/user"
	import {
		mapGetters
	} from 'vuex'

	export default {
		components: {
			UniButtonVcode
		},
		data() {
			return {
				errorType: formUtil.defaultErrorType,
				formData: {
					email: '',
					vcode: '',
					password: ''
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
					password: [{
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
							originEmailAddress: this.userInfo.emailAddress,
							verifyCode: this.vcode,
							password: this.password,
							targetEmailAddress: this.email
						}
						editEmailAddressRequest(params).then(res => {
							if (res.code === 0) {
								this.$toast('新邮箱绑定成功')
								uni.navigateBack()
							} else if (res.code === 1) {
								this.$toast('密码错误')
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
		margin-top: 50rpx;
		margin-bottom: 20rpx;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		text-align: left;
	}

	.tip-row {
		display: block;
		margin-bottom: 5rpx;
	}

    .submit-button {
        margin-top: 50rpx;
    }
</style>
