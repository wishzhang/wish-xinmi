<template>
    <div class="login">
        <van-form class="login-form" @submit="onSubmit">
            <van-field
                    v-model="username"
                    name="username"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"/>
            <van-field
                    v-model="password"
                    type="password"
                    name="password"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"/>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">登录</van-button>
            </div>
        </van-form>
        <div class="new-user">
            <router-link :to="{path: '/register'}">新用户注册</router-link>
        </div>
    </div>
</template>

<script>
    import {socket} from "../util/socket";
    import {mapGetters} from 'vuex';

    export default {
        name: "login",
        data() {
            return {
                username: '',
                password: '',
            };
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        created() {
            if (socket) {
                socket.disconnect();
            }
        },
        methods: {
            onSubmit(values) {
                this.$store.dispatch('Login', {
                    username: values.username,
                    password: values.password
                }).then((res) => {
                    if (res.code === 0) {
                        this.$store.dispatch('FetchUserInfo', res.data.id).then(res2 => {
                            this.$toast.success('登录成功');
                            this.$router.push({path: '/frame'});
                        })
                    } else {
                        this.$toast.fail(res.msg);
                    }
                }).catch(() => {
                })
            },
        },
    }
</script>

<style scoped lang="scss">
    .login {
        position: relative;
        height: 100%;

        .login-form {
            width: 100%;
            position: absolute;
            bottom: 100px;
        }
    }

    .new-user {
        position: absolute;
        bottom: 10px;
        right: 16px;
        font-size: 14px;
    }
</style>
