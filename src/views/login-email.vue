<template>
    <van-form ref="form" label-width="3em">
        <van-field
                v-model="address"
                name="address"
                label="邮箱"
                placeholder="请输入邮箱"
                autofocus
                clearable
                autocomplete="off"
                :rules="addressRules"/>
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
                <verify-code-button :disabled="!canGetVerifyCode"/>
            </template>
        </van-field>
        <div style="margin: 16px;">
            <van-button class="login-btn" round block type="info" native-type="button" @click="onLogin">登录</van-button>
            <van-cell class="login-tip" style="padding-top: 8px;text-align: center;" :border="false" title=""
                      :value="null"
                      label="未注册的邮箱验证通过后将自动注册"/>
        </div>
    </van-form>
</template>

<script>
    import {socket} from "../util/socket";
    import {mapGetters} from 'vuex';
    import {validEmail} from "@/util/validate";
    import VerifyCodeButton from '@/components/verify-code-button';

    export default {
        name: "login-email",
        components: {
            VerifyCodeButton
        },
        data() {
            return {
                address: '',
                verifyCode: '',
                canSeePassword: false
            };
        },
        computed: {
            ...mapGetters(['userInfo']),
            passwordInputType() {
                return this.canSeePassword ? 'text' : 'password';
            },
            addressRules() {
                return [{
                    message: '邮箱格式不正确',
                    validator(val) {
                        return validEmail(val);
                    },
                    trigger: 'none'
                }];
            },
            canGetVerifyCode() {
                return validEmail(this.address);
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
            onLogin() {
                this.$refs.form.validate('address').then(() => {
                    this.$refs.form.validate('verifyCode').then(() => {
                        this.$store.dispatch('Login', {
                            address: this.address,
                            verifyCode: this.verifyCode
                        }).then((res) => {
                            if (res.code === 0) {
                                this.$store.dispatch('FetchUserInfo', res.data.id).then(res2 => {
                                    this.$toast.success('登录成功');
                                    this.$router.push({path: '/index-layout/frame'});
                                })
                            } else {
                                this.$toast.fail(res.msg);
                            }
                        }).catch(() => {
                        })
                    }).catch(() => {

                    })
                }).catch(() => {

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
