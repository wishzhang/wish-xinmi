<template>
	<view class="uni-page-padding">
				<uni-navbar title="绑定邮箱修改"></uni-navbar>
		<view style="margin: 15rpx 0 12rpx;">
			<text>您之前绑定的邮箱是：</text><text class="uni-color-primary">fasdfSd@qq.com</text>
		</view>
		<uni-forms :modelValue="formData" ref="form" border>

			<uni-forms-item label="密码" name="password">
				<uni-easyinput :inputBorder="false" type="password" placeholder="请输入密码" v-model="formData.password" />
			</uni-forms-item>
			<uni-forms-item label="邮箱" name="email">
				<uni-easyinput :inputBorder="false" type="text" placeholder="请输入邮箱" v-model="formData.email" />
			</uni-forms-item>
			<uni-forms-item label="验证码" name="vcode">
				<view style="display: flex;align-items: center;">
					<uni-easyinput :inputBorder="false" type="text" placeholder="请输入验证码" v-model="formData.vcode" />
					<uni-button-vcode :valid="true"></uni-button-vcode>
				</view>
			</uni-forms-item>
			
			<view style="margin-top: 30px;">
				<button class="uni-button" type="default" @click="submitForm">提 交</button>
			</view>

			<view class="tip">
				<text class="tip-row">如果没有收到邮件，可以尝试：</text>
				<text class="tip-row">1. 在广告垃圾邮件中找找看</text>
				<text class="tip-row">2. 点击重新发送</text>
			</view>
		</uni-forms>
	</view>
</template>

<script>
	import UniButtonVcode from '@/components/uni-button-vcode/uni-button-vcode.vue'
	import util from '@/common/util.js'

	export default {
		components: {
			UniButtonVcode
		},
		data() {
			return {
				formData: {},
				rules: {
					email: {
						rules: [{
							format: 'email',
							errorMessage: '请输入正确的邮箱地址',
						}]
					},
					password: {
						rules: [{
								required: true,
								errorMessage: '请输入密码',
							},
							{
								validateFunction: function(rule, value, data, callback) {
									if (!util.validPassword(value)) {
										callback('密码为6-20位数字字母组合且不能有空格')
									}
									return true
								}
							}
						]
					}
				}
			}
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {
			submitForm() {
				this.$refs.form.validate().then(() => {}).catch(err => {
					console.log('表单错误信息：', err);
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.tip {
		margin-top: 20rpx;
		font-size: $uni-font-size-sm;
		color: $uni-text-color-grey;
		text-align: left;
	}
	
	.tip-row{
		display: block;
		margin-bottom: 5rpx;
	}
</style>
