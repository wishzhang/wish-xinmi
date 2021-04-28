<template>
    <van-form ref="form" class="login-form" label-width="2.4em">
        <van-field
                v-model="username"
                name="username"
                label="账号"
                placeholder="请输入账号"
                autofocus
                clearable
                autocomplete="off"
                :rules="usernameRules"/>
        <van-field
                v-model="password"
                :type="passwordInputType"
                name="password"
                label="密码"
                :maxlength="20"
                placeholder="请输入密码"
                clearable
                autocomplete="off"
                :rules="[{ required: true, message: '请输入密码', trigger: 'none' }]">
            <template #button>
                <div style="display: flex;align-items: center;">
                    <van-icon size="18px" v-if="canSeePassword" name="eye-o"
                              @click="onSwitchSeePassword"/>
                    <van-icon size="16px" style="font-size: 16px;" v-else name="closed-eye"
                              @click="onSwitchSeePassword"/>
                    <router-link to="/login/forget-password" class="primary-color"
                                 style="display: inline-block;margin-left: 8px;">忘记密码
                    </router-link>
                </div>
            </template>
        </van-field>
        <div style="margin: 32px 16px;">
            <van-button class="login-btn" block type="info" native-type="button" @click="onLogin">登录</van-button>
        </div>
    </van-form>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {validAccount} from "@/util/validate";
    import {loginByPasswordRequest} from "@/api/login";

    export default {
        name: "login-password",
        inject: ['login'],
        data() {
            return {
                username: '',
                password: '',
                canSeePassword: false
            };
        },
        computed: {
            ...mapGetters(['userInfo']),
            passwordInputType() {
                return this.canSeePassword ? 'text' : 'password';
            },
            usernameRules() {
                return [{
                    message: '账号在4-40字符以内，只能由英文、数字或下划线组成',
                    validator(val) {
                        return validAccount(val);
                    },
                    trigger: 'none'
                }];
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

                await this.$refs.form.validate('username');
                await this.$refs.form.validate('password');

                const params = {
                    username: this.username,
                    password: this.password
                }
                loginByPasswordRequest(params).then(res => {
                    if (res.code === 0) {
                        this.$toast.success('登录成功');
                        this.$store.commit('SET_USER_INFO', res.data);
                        this.$router.push({path: '/index-layout/frame'});
                    } else if (res.code === 1) {
                        this.$toast.fail('用户名或密码错误');
                    }
                })
            }
        },
    }
</script>

<style scoped lang="scss">
    .login-form {
        width: 100%;
    }

    .login-btn {
        font-size: 16px;
        letter-spacing: 2px;
    }
</style>
