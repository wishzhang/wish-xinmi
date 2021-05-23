<template>
    <basic-container>
        <van-nav-bar
                :left-text="'消息('+chatList.length+')'">
            <template #right>
                <van-popover
                        v-model="showPopover"
                        trigger="click"
                        :actions="actions"
                        :offset="[10,10]"
                        theme="dark"
                        placement="bottom-end"
                        @select="onSelect">
                    <template #reference>
                        <van-icon name="add-o" size="20" style="position: relative;top: 4px;"/>
                    </template>
                </van-popover>
            </template>
        </van-nav-bar>

        <van-cell v-for="item in chatList"
                  :key="item.chatId"
                  :value="item.createdAt"
                  :title="item.name"
                  @click="onChatClick(item)"
                  :label="item.content">
            <template #icon>
                <van-badge :content="item.unreadCount===0?'':item.unreadCount"
                           max="99">
                    <van-image
                            radius="4"
                            width="48"
                            height="48"
                            :src="item.avatarUrl|imageAvatar" style="margin-right: 12px;"/>
                </van-badge>
            </template>
        </van-cell>
    </basic-container>
</template>

<script>
    import {fetchMineAllChatListRequest} from "../../api/message";
    import {mapGetters} from 'vuex';

    export default {
        name: "frame-index-msg",
        data() {
            return {
                showPopover: false,
                actions: [{text: '添加朋友', icon: 'friends'}],
            }
        },
        computed: {
            ...mapGetters(['userInfo', 'chatList'])
        },
        created() {
            this.$store.dispatch('FetchMineAllChatList');
        },
        methods: {
            onSelect(action) {
                if (action.text === '添加朋友') {
                    this.$router.push({path: '/index-layout/contact-add'})
                }
            },
            onChatClick(item) {
                this.$router.push({path: '/index-layout/chat', query: {userId: item.contactId}})
            }
        }
    }
</script>

<style scoped>

</style>
