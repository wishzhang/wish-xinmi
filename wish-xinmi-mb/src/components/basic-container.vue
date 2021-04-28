<template>
    <div :style="style" class="basic-container">
        <slot></slot>
    </div>
</template>

<script>
    import {initSocket} from "../util/socket";
    import {mapGetters} from 'vuex';

    export default {
        name: "basic-container",
        props: {
            white: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            ...mapGetters(['userInfo']),
            style(){
                let s = {};
                if(this.white){
                    s.backgroundColor = 'white';
                }
                return s;
            }
        },
        created() {
            initSocket(this.userInfo.id);
        }
    }
</script>

<style scoped>
    .basic-container {
        position: relative;
        height: 100%;
        overflow-y: auto;
    }
</style>
