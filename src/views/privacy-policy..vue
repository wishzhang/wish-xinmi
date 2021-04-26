<template>
    <vue-markdown class="markdown-box">{{msg}}</vue-markdown>
</template>

<script>
    import VueMarkdown from 'vue-markdown';
    import agreementText from './privacy-policy.md';

    export default {
        name: "privacy-policy",
        components: {
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
        padding: 24px 16px;
        background-color: @app-bg-color;
    }
</style>