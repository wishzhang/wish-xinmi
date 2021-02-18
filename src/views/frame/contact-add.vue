<template>
    <basic-container>
        <van-nav-bar
                fixed
                title="添加联系人"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"/>
        <van-sticky :offset-top="46">
            <form>
                <van-search
                        v-model="username"
                        show-action
                        placeholder="请输入用户名"
                        @clear="onClear"
                        @search="onSearch"
                        @cancel="onCancel"/>
            </form>
        </van-sticky>

        <div style="margin-top: calc(46px)">
            <van-list
                    v-model="loading"
                    :finished="finished"
                    finished-text="没有更多了"
                    @load="onLoad">
                <van-cell
                        v-for="item in list"
                        :key="item.id"
                        center
                        :title="item.username"
                        @click="onItemClick(item)">
                    <template #icon>
                        <van-image
                                radius="4"
                                width="36"
                                height="36"
                                :src="item.avatarUrl|imageAvatar" style="margin: 0 8px 0 0;"/>
                    </template>
                </van-cell>
            </van-list>
        </div>
    </basic-container>
</template>

<script>
    import {fetchNoContactListRequest} from "../../api/contact";
    import {mapGetters} from 'vuex';

    export default {
        name: "contact-add",
        data() {
            return {
                username: '',
                list: [],
                loading: false,
                finished: false,
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        methods: {
            onClear() {
                this.onLoad();
            },
            onClickLeft() {
                history.back()
            },
            onSearch() {
                this.onLoad();
            },
            onCancel() {
                history.back()
            },
            onItemClick(item) {
                this.$router.push({path: '/contact-info-yet', query: {id: item.id}})
            },
            onLoad() {
                this.loading = false
                this.finished = true

                const params = {
                    id: this.userInfo.id,
                    username: this.username
                }
                fetchNoContactListRequest(params).then(res => {
                    this.list = res.data
                })
            },
        }
    }
</script>

<style scoped>

</style>
