<template>
    <forward-container title="修改密码">
        <van-cell :border="false">
            <template #title>
                <span>当前绑定的邮箱：</span><a>{{userInfo.emailAddress}}</a>
            </template>
        </van-cell>
        <van-form ref="form" label-width="4em">
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
                    <verify-code-button :disabled="!canGetVerifyCode" :email-address="userInfo.emailAddress"/>
                </template>
            </van-field>
            <van-field
                    v-model="password"
                    :type="passwordInputType"
                    name="password"
                    label="新密码"
                    :maxlength="20"
                    placeholder="请输入新密码"
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
            <van-field
                    v-model="rePassword"
                    :type="rePasswordInputType"
                    name="rePassword"
                    label="确认密码"
                    :maxlength="20"
                    placeholder="请确认新密码"
                    clearable
                    autocomplete="off"
                    :rules="rePasswordRules">
                <template #button>
                    <div style="display: flex;align-items: center;">
                        <van-icon size="18px" v-if="reCanSeePassword" name="eye-o"
                                  @click="onReSwitchSeePassword"/>
                        <van-icon size="16px" style="font-size: 16px;" v-else name="closed-eye"
                                  @click="onReSwitchSeePassword"/>
                    </div>
                </template>
            </van-field>
            <div style="margin: 16px;">
                <van-button class="login-btn" block type="info" native-type="button" @click="onSubmit">提交
                </van-button>
                <div style="margin-top: 16px;">
                    <div class="van-cell__label" style="font-size: 13px;">密码为6-20位数字字母组合 不能有空格</div>
                </div>
            </div>
        </van-form>
    </forward-container>
</template>

<script>
    import ForwardContainer from '@/components/forward-container';
    import {socket} from "../util/socket";
    import {mapGetters} from 'vuex';
    import {validEmail, validPassword} from "@/util/validate";
    import VerifyCodeButton from '@/components/verify-code-button';
    import {findPasswordByEmailRequest} from "@/api/login";

    export default {
        name: "email-setting",
        components: {
            ForwardContainer,
            VerifyCodeButton
        },
        data() {
            return {
                verifyCode: '',
                password: '',
                rePassword: '',
                canSeePassword: false,
                reCanSeePassword: false
            };
        },
        computed: {
            ...mapGetters(['userInfo']),
            passwordInputType() {
                return this.canSeePassword ? 'text' : 'password';
            },
            rePasswordInputType() {
                return this.reCanSeePassword ? 'text' : 'password';
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
            rePasswordRules() {
                return [{
                    message: '密码不一致',
                    validator: (val) => {
                        if (val !== this.password) {
                            return false;
                        }
                        return true;
                    },
                    trigger: 'none'
                }];
            },
            canGetVerifyCode() {
                return validEmail(this.userInfo.emailAddress);
            }
        },
        watch: {
            password() {
                this.rePassword = '';
            }
        },
        created() {
        },
        methods: {
            onSwitchSeePassword() {
                this.canSeePassword = !this.canSeePassword;
            },
            onReSwitchSeePassword() {
                this.reCanSeePassword = !this.reCanSeePassword;
            },
            async onSubmit() {
                try {
                    await this.$refs.form.validate('verifyCode');
                    await this.$refs.form.validate('password');
                    await this.$refs.form.validate('rePassword');

                    if (this.password !== this.rePassword) {
                        this.$toast.fail('密码不一致');
                        return;
                    }

                    const params = {
                        emailAddress: this.userInfo.emailAddress,
                        verifyCode: this.verifyCode,
                        newPassword: this.password
                    };
                    findPasswordByEmailRequest(params).then(res => {
                        if (res.code === 0) {
                            this.$toast.success('密码修改成功!');
                            history.back();
                        } else if (res.code === 2) {
                            this.$toast.fail('该邮箱未注册!');
                        }
                    });
                } catch (e) {

                }
            }
        },
    }
</script>

<style scoped lang="less">
    .login-btn {
        font-size: 16px;
        letter-spacing: 2px;
    }

    .login-tip {

        .van-cell__label {
            font-size: 13px;
            color: @gray-5;
            letter-spacing: 1px;
        }

    }
</style>