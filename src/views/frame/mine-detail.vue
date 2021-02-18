<template>
    <div>
        <van-nav-bar left-arrow
                     left-text="个人信息"
                     @click-left="onClickLeft">
        </van-nav-bar>
        <van-cell title="头像" center @click="onChooseFile">
            <template #right-icon>
                <div @click.stop="">
                    <van-uploader ref="uploader"
                                  :show-upload="true"
                                  :after-read="afterRead"
                                  :preview-image="true"
                                  :preview-options="{showIndex: false}"
                                  v-model="fileList">
                        <div style="display: none" class="hack-upload"></div>
                    </van-uploader>
                </div>
                <van-icon name="arrow" style="margin-left:0px;"/>
            </template>
        </van-cell>
        <van-cell :title="userInfo.username"></van-cell>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {putFile} from "@/api/common";
    import {updateUserInfoRequest} from "../../api/user";
    import Vue from 'vue';

    export default {
        name: "mine-detail",
        data() {
            return {
                fileList: [],
            }
        },
        computed: {
            ...mapGetters(['userInfo']),
        },
        mounted() {
            const imageAvatar = Vue.filter('imageAvatar');
            const avatarUrl = imageAvatar(this.userInfo.avatarUrl);

            const obj = {
                url: avatarUrl,
                previewSize: 60,
                deletable: false,
            };
            this.$set(this.fileList, 0, obj);
        },
        methods: {
            onClickLeft() {
                history.back();
            },
            onChooseFile() {
                this.$refs['uploader'].chooseFile()
            },
            afterRead(file) {
                file.status = 'uploading';
                putFile(file.file).then(res => {
                    if (res.code === 0) {
                        this.fileList[0].url = res.data.link;
                        const userInfo = JSON.parse(JSON.stringify(this.userInfo));
                        userInfo.avatarUrl = res.data.link;
                        this.$store.commit('SET_USER_INFO', userInfo);

                        const params = {
                            id: this.userInfo.id,
                            avatarUrl: userInfo.avatarUrl
                        }
                        updateUserInfoRequest(params).then(() => {
                            file.message = '更新成功';
                        }).catch(() => {
                            file.status = 'fail';
                            file.message = '更新失败';
                        })
                    }
                }).catch(() => {
                    file.status = 'fail';
                    file.message = '上传失败';
                }).finally(() => {
                    file.status = 'done';
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    /deep/ {
        .van-uploader__preview:not(:first-child) {
            display: none;
        }
    }
</style>
