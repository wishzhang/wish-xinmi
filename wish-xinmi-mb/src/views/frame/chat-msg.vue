<template>
    <basic-container>
        <div v-if="type==='left'" class="chat-bubble chat-bubble-left">
            <slot/>
        </div>
        <div v-else-if="type==='right'" class="chat-bubble chat-bubble-right">
            <slot/>
        </div>
    </basic-container>
</template>

<script>
  export default {
    name: "chat-msg",
    props: {
      type: {
        type: String,
        required: true
      }
    }
  }
</script>

<style scoped>
    .chat-bubble {
        position: relative;
        padding: 9px 10px;
        word-break: break-all;
        background: #fff;
        border-radius: 4px;
        min-height: 36px;
        display: flex;
        align-items: center;
        box-sizing: border-box;
    }

    .chat-bubble-left {
        margin-left: 6px;
    }

    .chat-bubble-left:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        left: -16px;
        top: 7px;
        border: 8px solid;
        border-color: transparent #ffffff transparent transparent;
    }

    .chat-bubble-right {
        margin-right: 6px;
        background-color: #91ED61;
    }

    .chat-bubble-right:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        right: -16px;
        top: 7px;
        border: 8px solid;
        border-color: transparent transparent transparent #91ED61;
    }

</style>
