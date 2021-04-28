<template>
    <basic-container white>
        <van-nav-bar left-arrow
                     left-text=""
                     @click-left="onClickLeft">
            <template #right>
                <van-button type="info" size="mini" text="发表"
                            @click="onSubmit"
                            :disabled="!canSend"></van-button>
            </template>
        </van-nav-bar>

        <van-form @submit="onSubmit">
            <van-field
                    v-model="thought"
                    name="thought"
                    placeholder="这一刻的想法..."
                    rows="4"
                    autosize
                    type="textarea"
            />
        </van-form>
        <div style="padding: 0 8px 0 16px;">
            <van-uploader v-model="fileList"
                          multiple
                          :preview-size="previewSize"
                          :max-count="9"/>
        </div>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {addThoughtRequest} from "../../api/thought";

    export default {
        name: "thought-send",
        data() {
            return {
                thought: '',
                fileList: []
            }
        },
        computed: {
            ...mapGetters(['userInfo']),
            pureThought() {
                return this.thought.trim();
            },
            canSend() {
                return this.pureThought !== '' || this.fileList.length > 0;
            },
            previewSize() {
                let canWidth = this.website.winWidth - 16 * 2 - 8 * 2;
                let unitWidth = Math.floor(canWidth / 3);
                return `${unitWidth}px`
            }
        },
        methods: {
            onClickLeft() {
                history.back();
            },
            onSubmit() {
                const formData = new FormData();
                formData.set('createUser', this.userInfo.id);
                formData.set('content', this.thought);

                this.fileList.forEach(file => {
                    formData.append('photos', file.file);
                })

                addThoughtRequest(formData).then(res => {
                    if (res.code === 0) {
                        this.$toast.success('发表成功');
                        history.back();
                    } else {
                        this.$toast.fail('发表失败');
                    }
                })
            },
            afterRead(file) {
                // 此时可以自行将文件上传至服务器
                console.log(file);
            },
        }
    }
</script>

<style scoped>

</style>
