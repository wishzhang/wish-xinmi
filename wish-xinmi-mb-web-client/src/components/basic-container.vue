<template>
    <div :style="style" class="basic-container">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "basic-container",
        props: {
            white: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            style(){
                let s = {};
                if(this.white){
                    s.backgroundColor = 'white';
                }
                return s;
            }
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
