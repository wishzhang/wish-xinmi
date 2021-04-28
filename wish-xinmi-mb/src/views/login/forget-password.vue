<template>
    <div style="background-color:white;height:100%;">
        <van-nav-bar
                title="找回密码"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"/>
        <van-form ref="form" style="margin-top: 8px;" label-width="3em">
            <van-field
                    label="邮箱"
                    v-model="emailAddress"
                    name="emailAddress"
                    placeholder="请输入邮箱"
                    autofocus
                    clearable
                    autocomplete="off"
                    :rules="emailAddressRules"/>
            <van-field
                    v-model="verifyCode"
                    name="verifyCode"
                    label="验证码"
                    placeholder="请输入验证码"
                    clearable
                    autocomplete="off"
                    maxlength="30"
                    :rules="[{ required: true, message: '请输入验证码', trigger: 'none' }]">
                <template #button>
                    <verify-code-button :disabled="!canGetVerifyCode" :email-address="emailAddress"/>
                </template>
            </van-field>
            <van-field
                    v-model="password"
                    :type="passwordInputType"
                    name="password"
                    label="新密码"
                    :maxlength="20"
                    placeholder="请设置密码"
                    clearable
                    autocomplete="off"
                    :rules="passwordRules">
                <template #button>
                    <div style="display: flex;align-items: center;">
                        <van-icon size="18px" v-if="canSeePassword" name="eye-o"
                                  @click="onSwitchSeePassword"/>
                        <van-icon size="16px" style="font-size: 16px;" v-else name="closed-eye"
                                  @click="onSwitchSeePassword"/>
                    </div>
                </template>
            </van-field>
            <van-cell class="tip" style="padding-top: 3px;text-align: left;" :border="false" title=""
                      :value="null"
                      label="密码为6-20位数字字母组合 不能有空格"/>
            <div style="margin: 20px 16px;">
                <van-button class="register-btn" block type="info" native-type="button" @click="onSubmit">提交
                </van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {validEmail, validPassword} from "@/util/validate";
    import {findPasswordByEmailRequest} from "@/api/login";
    import VerifyCodeButton from '@/components/verify-code-button';

    export default {
        name: "register",
        components: {
            VerifyCodeButton
        },
        data() {
            return {
                emailAddress: '',
                verifyCode: '',
                password: '',
                canSeePassword: false
            };
        },
        computed: {
            ...mapGetters(['userInfo']),
            passwordInputType() {
                return this.canSeePassword ? 'text' : 'password';
            },
            emailAddressRules() {
                return [{
                    message: '邮箱格式不正确',
                    validator(val) {
                        return validEmail(val);
                    },
                    trigger: 'none'
                }];
            },
            passwordRules() {
                return [{
                    message: '密码为6-20位数字字母组合 不能有空格',
                    validator(val) {
                        return validPassword(val);
                    },
                    trigger: 'none'
                }];
            },
            canGetVerifyCode() {
                return validEmail(this.emailAddress);
            }
        },
        methods: {
            onClickLeft() {
                history.back();
            },
            async onSubmit() {
                try {
                    await this.$refs.form.validate('emailAddress');
                    await this.$refs.form.validate('verifyCode');
                    await this.$refs.form.validate('password');

                    const params = {
                        emailAddress: this.emailAddress,
                        verifyCode: this.verifyCode,
                        newPassword: this.password
                    }
                    findPasswordByEmailRequest(params).then(res => {
                        if (res.code === 0) {
                            this.$toast.fail('提交成功！');
                            history.back();
                        } else if (res.code === 1) {
                            this.$toast.fail('邮箱未注册');
                        } else if (res.code === 2) {
                            this.$toast.fail('验证码错误');
                        }
                    })
                } catch (e) {

                }
            },
            onGetVerifyCode() {

            },
            onSwitchSeePassword() {
                this.canSeePassword = !this.canSeePassword;
            },
        },
    }
</script>

<style scoped lang="less">

    .register-btn {
        font-size: 16px;
        letter-spacing: 2px;
    }

    .tip {
        .van-cell__label {
            font-size: 13px;
            color: @gray-5;
            letter-spacing: 1px;
        }
    }
</style>