<template>
    <basic-container>
        <van-cell-group>
            <van-cell v-if="userInfo!==null"
                      :label="'信迷号：'+ userInfo.username"
                      is-link
                      style="padding: 30px 16px;"
                      :to="{path: '/index-layout/mine-detail'}"
                      center
                      :title="userInfo.username"
                      @click="onToMineDetail">
                <template #icon>
                    <van-image
                            radius="4"
                            width="48"
                            height="48"
                            :src="userInfo.avatarUrl|imageAvatar" style="margin: 0 8px 0 0;"/>
                </template>
            </van-cell>
        </van-cell-group>

        <van-cell value="设置"
                  is-link
                  :to="{path: '/index-layout/setting'}">
        </van-cell>
        <van-cell value="我发的朋友圈"
                  is-link
                  :to="{path: '/index-layout/thought-people', query: {userId: userInfo.userId}}">
        </van-cell>
    </basic-container>
</template>

<script>
    import {fetchUserInfoRequest} from "../../api/user";
    import {mapGetters} from 'vuex';

    export default {
        name: "frame-index-mine",
        data() {
            return {}
        },
        computed: {
            ...mapGetters(['userInfo']),
        },
        created() {
        },
        methods: {
            onToMineDetail() {

            }
        }
    }
</script>

<style scoped>

</style>
