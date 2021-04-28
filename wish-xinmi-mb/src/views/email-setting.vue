<template>
    <forward-container title="绑定邮箱修改">
        <van-cell :border="false">
            <template #title>
                <span>您之前绑定的邮箱是：</span><a>{{userInfo.emailAddress}}</a>
            </template>
        </van-cell>
        <van-form ref="form" label-width="3em">
            <van-field
                    v-model="password"
                    :type="passwordInputType"
                    name="password"
                    label="密码"
                    :maxlength="20"
                    placeholder="请输入密码(6-20位区分大小写)"
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
                    v-model="emailAddress"
                    name="emailAddress"
                    label="邮箱"
                    placeholder="请输入新邮箱"
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
            <div style="margin: 20px 16px;">
                <van-button class="login-btn" block type="info" native-type="button" @click="onSubmit">提交
                </van-button>
                <div style="margin-top: 16px;">
                    <div class="van-cell__label" style="font-size: 13px;">如果没有收到邮件，可以尝试：</div>
                    <div class="van-cell__label" style="font-size: 13px;">1. 在广告垃圾邮件中找找看</div>
                    <div class="van-cell__label" style="font-size: 13px;">2. 点击重新发送</div>
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
    import {editEmailAddressRequest} from "@/api/user";

    export default {
        name: "email-setting",
        components: {
            ForwardContainer,
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
        created() {
            if (socket) {
                socket.disconnect();
            }
        },
        methods: {
            onSwitchSeePassword() {
                this.canSeePassword = !this.canSeePassword;
            },
            async onSubmit() {
                await this.$refs.form.validate('password');
                await this.$refs.form.validate('emailAddress');
                await this.$refs.form.validate('verifyCode');
                const params = {
                    originEmailAddress: this.userInfo.emailAddress,
                    verifyCode: this.verifyCode,
                    password: this.password,
                    targetEmailAddress: this.emailAddress
                }
                editEmailAddressRequest(params).then(res => {
                    if (res.code === 0) {
                        this.$toast.fail('新邮箱绑定成功');
                        history.back();
                    } else if (res.code === 2) {
                        this.$toast.fail('验证码错误');
                    } else if (res.code === 1) {
                        this.$toast.fail('密码错误');
                    }
                })
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