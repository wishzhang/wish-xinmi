<template>
    <basic-container>
        <van-nav-bar left-arrow
                     fixed
                     placeholder
                     :left-text="title"
                     @click-left="onClickLeft"/>
        <slot></slot>
    </basic-container>
</template>

<script>
    export default {
        name: "forward-container",
        components: {},
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        data() {
            return {}
        },
        computed: {},
        created() {
        },
        mounted() {
        },
        methods: {
            onClickLeft() {
                history.back();
            }
        }
    }
</script>

<style scoped lang="less">
</style>
