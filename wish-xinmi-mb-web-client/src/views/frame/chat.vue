<template>
    <basic-container>
        <van-nav-bar left-arrow
                     fixed
                     placeholder
                     :left-text="userData.username"
                     @click-left="onClickLeft"/>
        <van-list
                :immediate-check="false"
                v-model="loading"
                :finished="finished"
                finished-text="没有更多记录了"
                direction="up"
                :offset="0"
                @load="onLoad">
            <div class="chat-list">
                <div class="chat-list-item" :key="ind"
                     v-for="(msg,ind) in list">
                    <template v-if="msg.type==='left'">
                        <div class="list-item item-your">
                            <van-image
                                    radius="4"
                                    width="36"
                                    height="36"
                                    :src="msg.avatarUrl|imageAvatar"
                                    style="margin: 0 8px 0 12px;"/>
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
                                    :src="msg.avatarUrl|imageAvatar" style="margin: 0 12px 0 8px;"/>
                        </div>
                    </template>
                </div>
            </div>
        </van-list>

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
    import {
        checkMessageRequest,
        addMessageToContactRequest,
        fetchContactMessagePageRequest,
    } from "../../api/message";

    export default {
        name: "chat",
        components: {
            ChatMsg
        },
        data() {
            return {
                message: '',
                userData: {},
                list: [],
                loading: false,
                finished: false,
                page: {
                    currentPage: 1,
                    total: 0
                },
                first: true,
                targetId: ''
            }
        },
        computed: {
            ...mapGetters(['userInfo']),
        },
        created() {
            this.targetId = this.$route.query.userId;

            const params1 = {
                userId: this.targetId
            }
            fetchUserInfoRequest(params1).then(res => {
                if (res.code === 0) {
                    this.userData = res.data;
                }
            });

            const params2 = {
                originUser: this.userInfo.userId,
                targetUser: this.targetId,
                current: this.page.currentPage++,
                size: 20
            }
            fetchContactMessagePageRequest(params2).then(res => {
                if (res.code === 0) {
                    const data = res.data;
                    this.page.total = data.total;
                    this.list = this.convertList(data.records).reverse();
                    this.scrollToBottom();
                }
            }).finally(() => {
            })
        },
        mounted() {
            if (socket) {
                socket.on('message-one-contact', data => {
                    console.log(data);
                    this.pushMessage(data);
                    this.scrollToBottom();
                })
            }
        },
        beforeDestroy() {
            const params3 = {
                userId: this.userInfo.userId,
                contactId: this.targetId
            };
            checkMessageRequest(params3).then(() => {
                this.$store.dispatch('FetchContactWarnNum');
            }).catch(() => {

            })
        },
        methods: {
            convertList(list = []) {
                const arr = list.map(el => {
                    if (el.originUser === this.userInfo.userId) {
                        return {
                            type: 'right',
                            content: el.content,
                            avatarUrl: el.originAvatarUrl
                        }
                    } else if (el.targetUser === this.userInfo.userId) {
                        return {
                            type: 'left',
                            content: el.content,
                            avatarUrl: el.targetAvatarUrl
                        }
                    }
                });
                return arr;
            },
            pushMessage({originUser, targetUser, content, originAvatarUrl, targetAvatarUrl}) {
                if (originUser === this.userInfo.userId) {
                    this.list.push({
                        type: 'right',
                        content: content,
                        avatarUrl: originAvatarUrl
                    })
                } else if (targetUser === this.userInfo.userId) {
                    this.list.push({
                        type: 'left',
                        content: content,
                        avatarUrl: targetAvatarUrl
                    })
                }
            },
            scrollToBottom() {
                setTimeout(() => {
                    const ele = document.querySelector('.basic-container');
                    if (ele) {
                        ele.scrollTop = ele.scrollHeight;
                    }
                })
            },
            onClickLeft() {
                this.$router.push({path: '/index-layout/frame/msg'})
            },
            onSend() {
                if (!this.message) {
                    this.$toast({message: '不能发空消息', position: 'bottom'})
                    return;
                }

                const params = {
                    originUser: this.userInfo.userId,
                    targetUser: this.$route.query.userId,
                    content: this.message,
                };

                const arr = this.convertList([{
                    originUser: params.originUser,
                    targetUser: params.targetUser,
                    content: params.content
                }]);

                this.list.push(...arr);

                this.scrollToBottom();

                addMessageToContactRequest(params).then(res => {

                }).catch(() => {
                    this.$toast.fail('发送失败！');
                })

                this.message = '';
            },
            onLoad() {
                this.fetchList();
            },
            fetchList() {
                const params2 = {
                    originUser: this.userInfo.userId,
                    targetUser: this.targetId,
                    current: this.page.currentPage++,
                    size: 10
                }

                this.loading = true;
                return fetchContactMessagePageRequest(params2).then(res => {
                    if (res.code === 0) {
                        const data = res.data;
                        this.page.total = data.total;
                        const arr = this.convertList(data.records);
                        this.list = [...arr.reverse(), ...this.list];
                        this.$nextTick(() => {
                            const ele = document.querySelector('.basic-container')
                            if (ele) {
                                ele.scrollTop = 600 - 120;
                            }
                        })
                        setTimeout(() => {
                            this.loading = false;
                        }, 2500)

                    }
                }).finally(() => {
                    if (this.page.total <= this.list.length) {
                        this.finished = true;
                    }
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .chat-list {
        padding-bottom: 60px;
        background-color: #f7f8fa;

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
