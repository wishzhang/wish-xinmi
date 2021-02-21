<template>
    <basic-container white>
        <van-nav-bar left-arrow
                     fixed
                     placeholder
                     :left-text="name"
                     @click-left="onClickLeft">
        </van-nav-bar>

        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">
            <div class="group-list">
                <div class="group-item" v-for="(groupItem, name) in group">
                    <div class="year">{{name}}年</div>
                    <div class="year-list">
                        <div class="list-item" v-for="item in groupItem">
                            <div class="date">
                                <span class="day">{{item.createTime|dateDay}}</span>
                                <span class="month">{{item.createTime|dateMonth}}月</span>
                            </div>
                            <div v-if="item.photosUrl&&item.photosUrl.length>0"
                                 style="display: flex">
                                <thought-people-photos :photos-url="item.photosUrl"></thought-people-photos>
                                <div style="margin-left: 6px;display: flex;flex-direction: column;justify-content: space-between;">
                                    <div>{{item.content}}</div>
                                    <div style="font-size:12px;color: #999;" v-if="getPhotosLen(item.photosUrl)>1">共{{getPhotosLen(item.photosUrl)}}张</div>
                                </div>
                            </div>
                            <div v-else class="content van-multi-ellipsis--l2">
                                {{item.content}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </van-list>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {fetchPeopleListRequest} from "@/api/thought";
    import {fetchContactDetailRequest} from "../../api/contact";
    import moment from "moment";
    import ThoughtPeoplePhotos from './thought-people-photos';

    export default {
        name: "thought-mine",
        data() {
            return {
                list: [],
                loading: true,
                finished: true,
                contactDetail: {}
            }
        },
        components: {
            ThoughtPeoplePhotos
        },
        computed: {
            ...mapGetters(['userInfo']),
            name() {
                return this.userInfo.id === this.$route.query.id ?
                    this.userInfo.username :
                    this.contactDetail.contactName
            },
            group() {
                const group = {};
                for (let item of this.list) {
                    const mom = moment(item.createTime);
                    const year = mom.year();
                    if (group[year]) {
                        group[year].push(item);
                    } else {
                        group[year] = [item];
                    }
                }
                return group;
            }
        },
        created() {
            if (this.userInfo.id !== this.$route.query.id) {
                const params1 = {
                    userId: this.userInfo.id,
                    contactId: this.$route.query.id
                }
                fetchContactDetailRequest(params1).then(res => {
                    if (res.code === 0) {
                        this.contactDetail = res.data;
                    }
                })
            }

            const params = {
                id: this.$route.query.id
            }
            fetchPeopleListRequest(params).then(res => {
                if (res.code === 0) {
                    this.list = res.data;
                }
            })
        },
        methods: {
            getPhotosLen(photosUrl) {
                if (!photosUrl) return 0;
                return photosUrl.split(',').length;
            },
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
        }
    }
</script>

<style scoped lang="less">
    .group-list {
        padding: 0 20px;

        .group-item {
            margin-top: 30px;

            .year {
                font-size: 28px;
                font-weight: bold;
            }

            .year-list {
                .list-item {
                    display: flex;
                    margin-top: 10px;
                    margin-bottom: 10px;

                    .date {
                        width: 75px;

                        .day {
                            font-size: 28px;
                            font-weight: bold;
                        }

                        .month {
                            font-size: 14px;
                            font-weight: bold;
                        }
                    }

                    .content {
                        flex: 1;
                        font-size: 14px;
                        background: #f7f8fa;
                        padding: 4px 8px;
                        align-self: flex-start;
                    }

                }
            }
        }
    }

</style>
