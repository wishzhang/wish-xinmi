<template>
    <forward-container title="用户隐私政策">
        <vue-markdown class="markdown-box">{{msg}}</vue-markdown>
    </forward-container>
</template>

<script>
    import VueMarkdown from '_vue-markdown@2.2.4@vue-markdown';
    import agreementText from '@/views/login/privacy-policy.md';
    import ForwardContainer from "@/components/forward-container";

    export default {
        name: "privacy-policy",
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