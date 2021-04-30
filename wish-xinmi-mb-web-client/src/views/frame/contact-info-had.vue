<template>
    <basic-container class="contact-info-had">
        <van-nav-bar left-arrow @click-left="onClickLeft">
            <template slot="right">
                <van-popover
                        v-model="showPopover"
                        trigger="click"
                        :actions="actions"
                        :offset="[10,5]"
                        theme="dark"
                        placement="bottom-end"
                        @select="onSelect">
                    <template #reference>
                        <van-icon name="ellipsis" size="20" style="position: relative;top: 4px;"/>
                    </template>
                </van-popover>
            </template>
        </van-nav-bar>
        <van-cell-group>
            <van-cell v-if="userData!==null"
                      :title="userData.name"
                      :label="'信迷号:'+userData.username"
                      center>
                <template #icon>
                    <van-image
                            radius="4"
                            width="36"
                            height="36"
                            :src="userData.avatarUrl|imageAvatar" style="margin: 0 8px 0 0;"/>
                </template>
            </van-cell>
        </van-cell-group>

        <van-cell title="备注名"
                  is-link
                  value=""
                  :to="{path: '/index-layout/contact-info-edit', query: {contactId: $route.query.id}}">
        </van-cell>

        <van-cell value="朋友圈"
                  is-link
                  style="margin-top: 16px;"
                  :to="{path: '/index-layout/thought-people', query: {id: $route.query.id}}">
        </van-cell>

        <div style="margin-top: 32px;">
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
                    v-else-if="userContactStatus===3"
                    style="margin-top: 10px;"
                    block
                    plain
                    hairline
                    type="info"
                    @click="onChat">发消息
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
        </div>

    </basic-container>
</template>

<script>
    import {fetchContactDetailRequest} from "../../api/contact";
    import {addContactRequest, fetchUserContactStatusRequest, deleteContactRequest} from "../../api/contact";
    import {mapGetters} from 'vuex';
    import {Dialog} from 'vant';

    export default {
        name: "contact-info",
        data() {
            return {
                userData: null,
                loadingAdd: false,
                userContactStatus: undefined,
                // 右上角气泡弹出框
                showPopover: false,
                actions: [{text: '删除联系人'}],
                list: [],
                loading: false,
                finished: true,
            }
        },
        computed: {
            ...mapGetters(['userInfo']),
        },
        created() {
            const params1 = {
                userId: this.userInfo.id,
                contactId: this.$route.query.id
            }
            fetchContactDetailRequest(params1).then(res => {
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
            },
            onSelect(action) {
                if (action.text === '删除联系人') {
                    Dialog.confirm({
                        message: `确定删除联系人 ${this.userData.name} 吗？`,
                        beforeClose: (action, done) => {
                            if (action === 'confirm') {
                                const params = {
                                    userId: this.userInfo.id,
                                    contactId: this.$route.query.id
                                };
                                deleteContactRequest(params).then(res => {
                                    this.$toast.success('删除成功！');
                                    history.back();
                                }).catch(() => {
                                    this.$toast.fail('删除失败！');
                                }).finally(() => {
                                    done();
                                })
                            } else {
                                done();
                            }
                        }
                    });
                }
            }
        }
    }
</script>

<style lang="less">
</style>
