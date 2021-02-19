<template>
    <basic-container>
        <van-nav-bar left-arrow @click-left="onClickLeft"/>
        <van-cell-group>
            <van-cell v-if="userData!==null" :title="userData.username" center>
                <template #icon>
                    <van-image
                            radius="4"
                            width="36"
                            height="36"
                            :src="userData.avatarUrl|imageAvatar" style="margin: 0 8px 0 0;"/>
                </template>
            </van-cell>
        </van-cell-group>

        <van-cell value="朋友圈"
                  is-link
                  :to="{path: '/index-layout/thought-people', query: {id: $route.query.id}}">
        </van-cell>

        <van-button
                v-if="userContactStatus===1"
                disabled
                style="margin-top: 10px;"
                block
                plain
                hairline
                type="info">已发送验证请求
        </van-button>
        <van-button
                v-else-if="userData!==null"
                style="margin-top: 10px;"
                block
                plain
                hairline
                type="info"
                :loading="loadingAdd"
                @click="onClickAdd">添加到联系人
        </van-button>
    </basic-container>
</template>

<script>
    import {fetchContactDetailRequest} from "../../api/contact";
    import {fetchUserInfoRequest} from "@/api/user";
    import {addContactRequest, fetchUserContactStatusRequest} from "../../api/contact";
    import {mapGetters} from 'vuex';

    export default {
        name: "contact-info",
        data() {
            return {
                userData: null,
                loadingAdd: false,
                userContactStatus: undefined,
            }
        },
        computed: {
            ...mapGetters(['userInfo']),
        },
        created() {
            const params1 = {
                id: this.$route.query.id
            }
            fetchUserInfoRequest(params1).then(res => {
                if (res.code === 0) {
                    this.userData = res.data;
                }
            })

            const params2 = {
                id: this.userInfo.id,
                contactId: this.$route.query.id
            }
            fetchUserContactStatusRequest(params2).then(res => {
                if (res.code === 0) {
                    this.userContactStatus = res.data;
                }
            })
        },
        methods: {
            onClickLeft() {
                history.back()
            },
            onClickAdd() {
                this.loadingAdd = true;
                const params = {
                    id: this.userInfo.id,
                    contactId: this.$route.query.id
                };
                addContactRequest(params).then(res => {
                    this.$toast.success('已发送验证信息');
                    history.back();
                }).catch(() => {
                    this.$toast.fail('添加失败');
                }).finally(() => {
                    this.loadingAdd = false;
                })
            },
            onChat() {
                this.$router.push({path: '/index-layout/chat', query: {id: this.$route.query.id}})
            }
        }
    }
</script>

<style scoped>

</style>
