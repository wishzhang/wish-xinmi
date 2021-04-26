<template>
    <div class="login">
        <div class="login-top-box">
            <img class="login-top-bg"/>
            <div class="web-title">信迷</div>
        </div>
        <component :is="curComponentName"/>

        <div class="login-footer">
            <van-divider style="margin: 8px 0px;">上次登录方式</van-divider>
            <div class="login-icon-list">
                <i v-if="curloginTypeMap!==loginTypeMap.email.name" class="iconfont iconyouxiang"
                   style="font-size: 24px;margin: 0 4px;" @click="onSelectloginTypeMap(loginTypeMap.email.name)"></i>
                <i v-if="curloginTypeMap!==loginTypeMap.password.name" class="iconfont iconsuo"
                   style="font-size: 23px;margin: 0 4px;" @click="onSelectloginTypeMap(loginTypeMap.password.name)"></i>
            </div>
            <div class="statement">
                登录表示同意
                <router-link to="/user-agreement">用户协议</router-link>
                和
                <router-link to="/privacy-policy">隐私政策</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import {socket} from "../util/socket";
    import {mapGetters} from 'vuex';
    import {validAccount} from "@/util/validate";
    import LoginEmail from './login-email';
    import LoginPassword from './login-password';

    export default {
        name: "login",
        components: {
            LoginEmail,
            LoginPassword
        },
        data() {
            return {
                curloginTypeMap: '',
                loginTypeMap: {
                    email: {
                        name: 'email',
                        componentName: LoginEmail.name
                    },
                    password: {
                        name: 'password',
                        componentName: LoginPassword.name
                    }
                }
            };
        },
        computed: {
            ...mapGetters(['userInfo', 'loginType']),
            curComponentName() {
                return this.loginTypeMap[this.curloginTypeMap].componentName
            }
        },
        created() {
            if (socket) {
                socket.disconnect();
            }
            this.curloginTypeMap = this.loginType;
        },
        methods: {
            onSelectloginTypeMap(loginTypeMapName) {
                this.curloginTypeMap = loginTypeMapName;
                this.$store.commit('SET_LOGIN_TYPE', loginTypeMapName);
            }
        },
    }
</script>

<style scoped lang="less">
    .login {
        background: white;
        position: relative;
        height: 100%;

        .login-top-box {
            position: relative;
            height: 150px;
            text-align: center;
            overflow: hidden;

            .login-top-bg {
                position: absolute;
                width: 100%;
                height: 90%;
                left: 0;
                right: 0;
                background-image: url("/img/bg_login.png");
                opacity: 0.1;
                display: none;
            }

            .web-title {
                margin-top: 80px;
                font-size: 18px;
                letter-spacing: 2px
            }
        }

        .login-form {
            width: 100%;
        }
    }

    .login-footer {
        position: absolute;
        bottom: 10px;
        left: 16px;
        right: 16px;
        font-size: 14px;

        .login-icon-list {
            text-align: center;
            color: @gray-4;
            height: 28px;
        }

        .statement {
            margin-top: 10px;
            text-align: center;
        }
    }
</style>
