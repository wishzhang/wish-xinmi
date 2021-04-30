<template>
    <div id="index-layout">
        <router-view></router-view>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {initSocket} from "../util/socket";
    import {dateFormat} from "@/util/datetime";

    let timer = null;

    export default {
        name: "index-layout",
        computed: {
            ...mapGetters(['userInfo', 'serverTime'])
        },
        created() {
            const self = this;
            const socket = initSocket(this.userInfo.username);
            if(socket){
                socket.on('contact-add-contact', num=>{
                    debugger
                    self.$store.commit('SET_CONTACT_WARN_NUM', num);
                })
            }

            this.$store.dispatch('FetchSuccessLoginInitData', this.userInfo.id);
            this.setServerTime();
        },
        methods: {
            setServerTime() {
                const self = this;
                this.$store.dispatch('FetchServerTime').then(initServerTime => {
                    if (timer !== null) {
                        clearTimeout(timer);
                    }

                    initServerTime = new Date(initServerTime).getTime();

                    let interval = 1000,
                        start = new Date().getTime(),
                        count = 0;

                    timer = setTimeout(countDownStart, interval);

                    function countDownStart() {
                        let offset, nextTime, seconds;
                        count++;
                        offset = new Date().getTime() - (start + count * interval);
                        if (offset > 1000) {
                            seconds = Math.trunc(offset / 1000);
                            initServerTime += seconds;

                            offset = offset % 1000;
                        }

                        initServerTime += 1000;

                        nextTime = interval - offset;

                        self.$store.commit('SET_SERVER_TIME', initServerTime);
                        timer = setTimeout(countDownStart, nextTime);
                    }
                })
            }
        }
    }
</script>

<style scoped lang="less">
    #index-layout {
        height: 100%;
    }
</style>
