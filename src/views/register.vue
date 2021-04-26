<template>
    <div style="background-color:white;height:100%;">
        <van-nav-bar
                title="新用户注册"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"/>
        <van-form ref="form" style="margin-top: 25px;" label-width="2.4em">
            <van-field
                    v-model="username"
                    name="username"
                    label="账号"
                    placeholder="请输入账号"
                    autofocus
                    clearable
                    autocomplete="off"
                    :rules="[{ required: true, message: '请输入账号' }]"/>
            <van-field
                    v-model="password"
                    type="password"
                    name="password"
                    placeholder="请设置密码"
                    clearable
                    label="密码"
                    :rules="[{ required: true, message: '请设置密码' }]"/>
            <van-cell style="padding-top: 3px;" size="large" :border="false" title="" :value="null"
                      label="密码为6-20位数字字母组合 不能有空格"/>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="button" @click="onRegister">注 册</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
    import {registerRequest} from "../api/register";

    export default {
        name: "register",
        data() {
            return {
                username: '',
                password: '',
            };
        },
        methods: {
            onClickLeft() {
                history.back();
            },
            onRegister() {
                this.$refs.form.validate('username').then(() => {
                    this.$refs.form.validate('password').then(() => {
                        const params = {
                            username: this.username,
                            password: this.password
                        }
                        registerRequest(params).then(() => {
                            this.$toast.success('注册成功');
                            history.back();
                        }).catch(() => {
                            this.$toast.fail('注册失败');
                        })
                    }).catch(() => {

                    })
                }).catch(() => {

                })
            },
        },
    }
</script>

<style scoped lang="scss">
</style>