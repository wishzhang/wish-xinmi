<template>
    <div class="basic-container">
        <slot></slot>
    </div>
</template>

<script>
  import {initSocket} from "../util/socket";
  import {mapGetters} from 'vuex';

  export default {
    name: "basic-container",
    computed: {
      ...mapGetters(['userInfo'])
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