<template>
    <basic-container :class="{thought: fadeNavbar}" white id="scroll-id">
        <div style="height:auto;">
            <van-nav-bar left-arrow
                         fixed
                         left-text="朋友圈"
                         @click-left="onClickLeft">
                <template #right>
                    <van-icon name="photograph" size="18" @click="onSendThoughtClick"/>
                </template>
            </van-nav-bar>
            <div class="bg-box">
                <van-image
                        width="100%"
                        height="240"
                        fit="cover"
                        :src="userInfo.bgUrl||'/img/bg-default.jpg'"
                        @click="showPicker = true"
                />
                <div class="profile">
                    <div class="username">易聪</div>
                    <van-image
                            width="60"
                            height="60"
                            fit="cover"
                            :radius="4"
                            :src="userInfo.avatarUrl|imageAvatar"/>
                </div>
            </div>
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
                            <div class="circle-item-photo">
                                <photo-gallery :photosUrl="item.photosUrl"></photo-gallery>
                            </div>
                            <div class="circle-item-footer">
                                <span class="circle-item-footer-time">{{item.createTime}}</span>
                            </div>
                        </div>
                    </div>
                    <van-divider/>
                </div>
            </van-list>
        </div>
        <van-popup v-model="showPicker" round position="bottom">
            <van-picker
                    title="更换背景图"
                    :item-height="200"
                    show-toolbar
                    :visible-item-count="3"
                    :default-index="1"
                    :columns="columns"
                    @cancel="showPicker = false"
                    @confirm="onConfirm">
                <template slot="option" slot-scope="option">
                    <div style="position: relative;">
                        <van-image
                                width="100%"
                                height="190"
                                fit="cover"
                                :radius="4"
                                :src="option"
                        />
                    </div>
                </template>
            </van-picker>
        </van-popup>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {fetchMineAllListRequest} from "@/api/thought";
    import {updateUserInfoRequest} from "@/api/user";

    export default {
        name: "thought",
        data() {
            return {
                list: [],
                loading: true,
                finished: true,

                fadeNavbar: true,

                // 动作面板
                showPicker: false,
                columns: [
                    '/img/bg1.jpg',
                    '/img/bg2.jpg',
                    '/img/bg3.jpg',
                    '/img/bg4.jpg',
                    '/img/bg5.jpg',
                    '/img/bg6.jpg',
                ],
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
        mounted() {
            const el = document.getElementById('scroll-id');
            el.addEventListener('scroll', (e) => {
                if (e.target.scrollTop > 220) {
                    this.fadeNavbar = false;
                } else {
                    this.fadeNavbar = true;
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
                this.$router.push({path: '/index-layout/thought-send'});
            },
            onConfirm(value) {
                const params = {
                    id: this.userInfo.id,
                    bgUrl: value
                }
                updateUserInfoRequest(params).then(res => {
                    if (res.code === 0) {
                        const userInfo = JSON.parse(JSON.stringify(this.userInfo));
                        userInfo.bgUrl = value;
                        this.$store.commit('SET_USER_INFO', userInfo);
                    }
                }).finally(() => {
                    this.showPicker = false;
                })
            },
        }
    }
</script>

<style scoped lang="less">

    /deep/ .van-divider {
        margin: 0;
    }

    .thought {
        /deep/ .van-nav-bar {
            background-color: transparent !important;
        }

        /deep/ .van-nav-bar__content {
            background-color: transparent !important;
        }

        /deep/ .van-nav-bar__text {
            color: white;
        }

        /deep/ .van-icon {
            color: white;
        }
    }


    /deep/ [class*='van-hairline']::after {
        display: none;
    }

    .bg-box {
        position: relative;
        margin-bottom: 70px;

        .profile {
            position: absolute;
            bottom: -12px;
            right: 16px;
            display: flex;
            align-items: center;
            font-size: 0px;

            .username {
                margin-right: 10px;
                font-size: 16px;
                color: white;
            }
        }
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
            }

            .circle-item-photo {
                margin-top: 8px;
            }

            .circle-item-footer {
                margin: 8px 0px;

                .circle-item-footer-time {
                    position: relative;
                    top: 1px;
                    font-size: 12px;
                    color: #999;
                }
            }
        }
    }
</style>
