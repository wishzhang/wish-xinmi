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
                    <router-link to="/forget-password" class="primary-color"
                                 style="display: inline-block;margin-left: 8px;"
                                 @click="onForgetPassword">忘记密码
                    </router-link>
                </div>
            </template>
        </van-field>
        <div style="margin: 16px;">
            <van-button class="login-btn" round block type="info" native-type="button" @click="onLogin">登录</van-button>
        </div>
    </van-form>

</template>

<script>
    import {mapGetters} from 'vuex';
    import {validAccount} from "@/util/validate";

    export default {
        name: "login-password",
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
            passwordRules() {

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
            onLogin() {
                this.$refs.form.validate('username').then(() => {
                    this.$refs.form.validate('password').then(() => {
                        this.$store.dispatch('Login', {
                            username: this.username,
                            password: this.password
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
            onForgetPassword() {
                alert();
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
