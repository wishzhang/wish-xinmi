<template>
    <div :style="{backgroundColor: white}" class="basic-container">
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
                default: false
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        created() {
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
