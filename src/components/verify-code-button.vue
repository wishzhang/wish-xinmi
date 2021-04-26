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
    export default {
        name: "verify-code-button",
        props: {
            disabled: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isLocking: false,
                isLoading: false,
                restSeconds: 60,
                timer: null
            }
        },
        methods: {
            onGetVerifyCode() {
                if (!this.isLoading) {
                    this.isLoading = true;
                    // 请求
                    setTimeout(() => {
                        this.isLoading = false;
                        // 请求成功，锁定60s
                        this.isLocking = true;
                        this.restSeconds = 60;
                        this.timer = setInterval(() => {
                            this.restSeconds--;
                            if (this.restSeconds === 0) {
                                this.isLocking = false;
                                clearInterval(this.timer);
                            }
                        }, 1000)
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>