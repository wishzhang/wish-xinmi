<template>
    <forward-container title="修改账号">
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
            <div style="margin: 32px;">
                <van-button class="login-btn" round block type="info" native-type="button" @click="onSubmit">提交
                </van-button>
            </div>
        </van-form>
    </forward-container>
</template>

<script>
    import ForwardContainer from '@/components/forward-container';
    import {mapGetters} from 'vuex';
    import {validAccount} from "@/util/validate";

    export default {
        name: "account-setting",
        components: {
            ForwardContainer
        },
        data() {
            return {
                username: '',
            };
        },
        computed: {
            ...mapGetters(['userInfo']),
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
            async onSubmit() {
                try {
                    await this.$refs.form.validate('username');
                } catch (e) {

                }
            }
        },
    }
</script>

<style scoped>
    .login-form {
        width: 100%;
    }

    .login-btn {
        font-size: 16px;
        letter-spacing: 2px;
    }
</style>