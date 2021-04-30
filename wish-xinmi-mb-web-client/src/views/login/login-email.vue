<template>
    <van-form ref="form" label-width="3em">
        <van-field
                v-model="emailAddress"
                name="emailAddress"
                label="邮箱"
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
        <div style="margin:32px 16px;">
            <van-button class="login-btn" block type="info" native-type="button" @click="onLogin">登录</van-button>
            <van-cell class="login-tip" style="padding-top: 8px;text-align: center;" :border="false" title=""
                      :value="null"
                      label="未注册的邮箱验证通过后将自动注册"/>
        </div>
    </van-form>
</template>

<script>
    import {socket} from "../../util/socket";
    import {mapGetters} from 'vuex';
    import {validEmail} from "@/util/validate";
    import VerifyCodeButton from '@/components/verify-code-button';
    import {loginByEmailRequest} from "@/api/login";

    export default {
        name: "login-email",
        inject: ['login'],
        components: {
            VerifyCodeButton
        },
        data() {
            return {
                emailAddress: '',
                verifyCode: '',
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
            canGetVerifyCode() {
                return validEmail(this.emailAddress);
            }
        },
        created() {
            if (socket) {
                socket.disconnect();
            }
        },
        methods: {
            onSwitchSeePassword() {
                this.canSeePassword = !this.canSeePassword;
            },
            async onLogin() {
                if (!this.login.isAgree) {
                    this.$toast.fail('请阅读并勾选下方协议');
                    return;
                }

                await this.$refs.form.validate('emailAddress');
                await this.$refs.form.validate('verifyCode');

                const params = {
                    emailAddress: this.emailAddress,
                    verifyCode: this.verifyCode
                };
                loginByEmailRequest(params).then(res => {
                    if (res.code === 0) {
                        this.$emit('login-success', res);
                    } else if (res.code === 2) {
                        this.$toast.fail('验证码错误');
                    }
                })
            },
            onGetVerifyCode() {

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
