<template>
    <forward-container title="用户协议">
        <vue-markdown class="markdown-box">{{msg}}</vue-markdown>
    </forward-container>
</template>

<script>
    import VueMarkdown from '_vue-markdown@2.2.4@vue-markdown';
    import agreementText from '@/views/login/user-agreement.md';
    import ForwardContainer from "@/components/forward-container";

    export default {
        name: "user-agreement",
        components: {
            ForwardContainer,
            VueMarkdown
        },
        data() {
            return {
                msg: agreementText
            }
        }
    }
</script>

<style scoped lang="less">
    .markdown-box {
        padding: 12px 16px;
        background-color: @app-bg-color;
    }
</style>