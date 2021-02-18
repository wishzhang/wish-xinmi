<template>
    <basic-container style="background:white;">
        <van-nav-bar left-arrow
                     left-text="朋友圈"
                     @click-left="onClickLeft">
            <template #right>
                <van-icon name="photograph" size="18" @click="onSendThoughtClick"/>
            </template>
        </van-nav-bar>
        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">
            <div v-for="item in list" :key="item.id">
                <div class="circle-item">
                    <van-image style="margin-right:10px;" width="40" height="40"
                               :src="item.avatarUrl|imageAvatar"></van-image>
                    <div class="circle-item-right">
                        <div class="circle-item-name">{{getName(item)}}</div>
                        <div class="circle-item-content">
                            {{item.content}}
                        </div>
                        <div class="circle-item-footer">
                            <span class="circle-item-footer-time">{{item.createTime}}</span>
                        </div>
                    </div>
                </div>
                <van-divider/>
            </div>
        </van-list>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {fetchMineAllListRequest} from "@/api/thought";

    export default {
        name: "thought",
        data() {
            return {
                list: [],
                loading: true,
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
            fetchMineAllListRequest(params).then(res => {
                if (res.code === 0) {
                    this.list = res.data;
                }
            })
        },
        methods: {
            getName(item) {
                return item.createUser === this.userInfo.id ?
                    item.username :
                    item.contactName;
            },
            onClickLeft() {
                history.back();
            },
            onLoad() {

            },
            onSendThoughtClick() {
                this.$router.push({path: '/thought-send'});
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .van-divider {
        margin: 0;
    }

    .circle-item {
        display: flex;
        padding: 10px 10px 5px;

        .circle-item-right {
            flex: 1;

            .circle-item-name {
                font-size: 14px;
                font-weight: bold;
                font-family: PingFangSC-Regular;
                color: darkcyan;
            }

            .circle-item-content {
                margin-top: 3px;
                min-height: 30px;
            }

            .circle-item-footer {
                .circle-item-footer-time {
                    font-size: 12px;
                }
            }
        }
    }
</style>
