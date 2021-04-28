<template>
    <basic-container>
        <van-nav-bar
                :left-text="'消息('+list.length+')'">
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

        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">
            <van-cell v-for="item in list"
                      :key="item.chatId"
                      :value="item.createTime"
                      :title="item.towardsName"
                      @click="onChatClick(item)"
                      :label="item.content">
                <template #icon>
                    <van-image
                            radius="4"
                            width="48"
                            height="48"
                            :src="item.avatarUrl|imageAvatar" style="margin-right: 8px;"/>
                </template>
            </van-cell>
        </van-list>
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
                list: [],
                loading: false,
                finished: true,
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        created() {
            const params = {
                id: this.userInfo.id
            }
            fetchMineAllChatListRequest(params).then(res => {
                if (res.code === 0) {
                    this.list = res.data;
                }
            })
        },
        methods: {
            onSelect(action) {
                if (action.text === '添加朋友') {
                    this.$router.push({path: '/index-layout/contact-add'})
                }
            },
            onLoad() {
                const params = {
                    id: this.userInfo.id
                }
                fetchMineAllChatListRequest(params).then(res => {
                    if (res.code === 0) {
                        this.list = res.data;
                    }
                })
            },
            onChatClick(item) {
                let id = item.originUser === this.userInfo.id ? item.targetUser
                    : item.targetUser === this.userInfo.id ? item.originUser : undefined;
                if (!id) {
                    throw TypeError();
                }

                this.$router.push({path: '/index-layout/chat', query: {id: id}})
            }
        }
    }
</script>

<style scoped>

</style>
