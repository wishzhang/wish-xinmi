<template>
    <div>
        <template v-if="isLocking">
            <a style="vertical-align: center;">剩 {{restSeconds}} 秒</a>
        </template>
        <template v-else>
            <a v-if="!disabled"
               @click="onGetVerifyCode">获取验证码
            </a>
            <span v-else style="display: inline-block;margin-left: 8px;">获取验证码</span>
        </template>

    </div>
</template>

<script>
    import {sendEmailRequest} from "@/api/verifycode";

    export default {
        name: "verify-code-button",
        props: {
            disabled: {
                type: Boolean,
                default: false
            },
            emailAddress: {
                type: String
            }
        },
        data() {
            return {
                theEmailAddress: '',
                isLocking: false,
                isLoading: false,
                restSeconds: 60,
                timer: null
            }
        },
        watch: {
            emailAddress: {
                immediate: true,
                handler(val) {
                    this.theEmailAddress = val;
                }
            }
        },
        methods: {
            onGetVerifyCode() {
                if (!this.isLoading) {
                    this.isLoading = true;
                    const params = {
                        emailAddress: this.theEmailAddress
                    };
                    sendEmailRequest(params).then(res => {
                        this.$toast.success('已发送验证码');
                        this.isLocking = true;
                        this.restSeconds = 60;
                        this.timer = setInterval(() => {
                            this.restSeconds--;
                            if (this.restSeconds === 0) {
                                this.isLocking = false;
                                clearInterval(this.timer);
                            }
                        }, 1000)
                    }).catch(() => {
                        this.$toast.fail('发送失败');
                    }).finally(() => {
                        this.isLoading = false;
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>