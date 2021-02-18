<template>
    <basic-container>
        <van-nav-bar left-arrow
                     left-text="设置"
                     @click-left="onClickLeft"/>
        <van-button @click="onLoginOut" style="position: absolute;bottom:30px;" block type="default">退出</van-button>
    </basic-container>
</template>

<script>
    import {socket} from "../util/socket";
    import {mapGetters} from 'vuex';

    export default {
        name: "setting",
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            onLoginOut() {
                this.$store.dispatch('Logout').then(() => {
                    if (socket !== null) {
                        socket.emit('sessionOff', {userId: this.userInfo.id})
                        socket.disconnect();
                    }
                    this.$router.push({path: '/login'});
                })
            },
            onClickLeft() {
                history.back();
            }
        }
    }
</script>

<style scoped>

</style>
