<template>
    <basic-container white>
        <van-nav-bar left-arrow
                     left-text="发表文字"
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
            />
        </van-form>
    </basic-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {addThoughtRequest} from "../../api/thought";

    export default {
        name: "thought-send",
        data() {
            return {
                thought: ''
            }
        },
        computed: {
            ...mapGetters(['userInfo']),
            pureThought() {
                return this.thought.trim();
            },
            canSend() {
                return this.pureThought !== '';
            }
        },
        methods: {
            onClickLeft() {
                history.back();
            },
            onSubmit() {
                const params = {
                    createUser: this.userInfo.id,
                    content: this.thought
                };
                addThoughtRequest(params).then(res => {
                    if (res.code === 0) {
                        this.$toast.success('发表成功');
                        history.back();
                    } else {
                        this.$toast.fail('发表失败');
                    }
                })
            },
        }
    }
</script>

<style scoped>

</style>
