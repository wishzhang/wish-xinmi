<template>
    <basic-container>
        <van-nav-bar left-arrow
                     fixed
                     placeholder
                     :left-text="userData.username"
                     @click-left="onClickLeft"/>
        <div id="scroll-id" class="chat-list">
            <div class="chat-list-item" :key="ind"
                 v-for="(msg,ind) in list">
                <template v-if="msg.type==='left'">
                    <div class="list-item item-your">
                        <van-image
                                radius="4"
                                width="36"
                                height="36"
                                src="/api/img/default-avatar.png" style="margin: 0 8px 0 12px;"/>
                        <chat-msg type="left" class="item-msg">{{msg.content}}</chat-msg>
                    </div>
                </template>
                <template v-else-if="msg.type==='right'">
                    <div class="list-item item-mine">
                        <chat-msg type="right" class="item-msg">{{msg.content}}</chat-msg>
                        <van-image
                                radius="4"
                                width="36"
                                height="36"
                                src="/api/img/default-avatar.png" style="margin: 0 12px 0 8px;"/>
                    </div>
                </template>
            </div>
        </div>

        <van-field
                class="send-box"
                v-model="message"
                center
                clearable
                :border="false"
                placeholder="">
            <template #button>
                <van-button size="small" type="primary" @click="onSend">发 送</van-button>
            </template>
        </van-field>
    </basic-container>
</template>

<script>
  import {fetchUserInfoRequest} from "../../api/user";
  import ChatMsg from './chat-msg';
  import {mapGetters} from 'vuex';
  import {socket} from "../../util/socket";
  import {fetchContactMessageListRequest} from "../../api/message";

  export default {
    name: "chat",
    components: {
      ChatMsg
    },
    data() {
      return {
        message: '',
        userData: {},
        list: []
      }
    },
    computed: {
      ...mapGetters(['userInfo']),
      targetId() {
        return this.$route.query.id;
      }
    },
    created() {
      const params1 = {
        id: this.targetId
      }
      fetchUserInfoRequest(params1).then(res => {
        if (res.code === 0) {
          this.userData = res.data;
        }
      })

      const params2 = {
        originUser: this.userInfo.id,
        targetUser: this.targetId
      }
      fetchContactMessageListRequest(params2).then(res => {
        if (res.code === 0) {
          this.list = res.data.map(el => {
            if (el.originUser === this.userInfo.id && el.targetUser === this.targetId) {
              return {
                type: 'right',
                content: el.content
              }
            } else if (el.originUser === this.targetId && el.targetUser === this.userInfo.id) {
              return {
                type: 'left',
                content: el.content
              }
            }
          })
          setTimeout(() => {
            this.scrollToBottom();
          })
        }
      })
    },
    mounted() {
      if (socket) {
        socket.on('message', res => {
          if (res.code === 0) {
            this.list.push({
              type: 'left',
              content: res.data.content
            });
            setTimeout(() => {
              this.scrollToBottom();
            })
          } else if (res.code === 1) {
            console.log(res);
          }
        })
      }
    },
    methods: {
      scrollToBottom() {
        const ele = document.querySelector('.basic-container');
        if (ele) {
          ele.scrollTop = ele.scrollHeight;
        }
      },
      onClickLeft() {
        this.$router.push({path: '/frame/msg'})
      },
      onSend() {
        if (!this.message) {
          this.$toast({message: '不能发空消息', position: 'bottom'})
          return;
        }
        const obj = {
          originUser: this.userInfo.id,
          targetUser: this.$route.query.id,
          content: this.message
        };
        try {
          socket.send(obj);
          this.list.push({
            type: 'right',
            content: obj.content
          });
          this.message = '';
          setTimeout(() => {
            this.scrollToBottom();
          })
        } catch (e) {
          console.log('....')
          console.log(e);
        }
      }
    }
  }
</script>

<style scoped lang="scss">
    .chat-list {
        padding-bottom: 60px;
        background-color: #f1f1f1;

        .chat-list-item {
            .list-item {
                width: 100%;
                display: flex;
                margin: 12px 0;
                box-sizing: border-box;

                &.item-your {
                    justify-content: flex-start;
                    padding-right: 66px;

                    .item-avatar {
                        margin-left: 14px;
                    }
                }

                &.item-mine {
                    justify-items: flex-end;
                    padding-left: 66px;

                    .item-avatar {
                        margin-right: 14px;
                    }
                }

                .item-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 3px;
                }

                .item-msg {
                    flex: 1;
                }

            }
        }
    }

    .send-box {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>