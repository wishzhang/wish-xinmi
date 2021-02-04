<template>
    <basic-container>
        <div class="frame-index-main">
            <router-view></router-view>
        </div>
        <van-tabbar route>
            <van-tabbar-item
                    replace to="/frame/msg"
                    icon="chat-o">消息
            </van-tabbar-item>
            <van-tabbar-item
                    replace to="/frame/contact"
                    icon="friends-o">联系人
            </van-tabbar-item>
            <van-tabbar-item
                    replace to="/frame/discover"
                    icon="friends-o">朋友圈
            </van-tabbar-item>
            <van-tabbar-item
                    replace to="/frame/mine"
                    icon="user-circle-o">我的
            </van-tabbar-item>
        </van-tabbar>
    </basic-container>
</template>

<script>
    export default {
        name: "frame",
        components: {},
        data() {
            return {
                active: ''
            }
        },

        created() {

        },
        methods: {}
    }
</script>

<style scoped>
    .frame-index-main {
        height: calc(100% - 50px);
    }
</style>
