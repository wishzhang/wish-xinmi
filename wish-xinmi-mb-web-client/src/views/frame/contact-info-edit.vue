<template>
    <forward-container title="设置备注">
        <van-form @submit="onSubmit" label-width="4em">
            <van-field
                    v-model="contactData.contactName"
                    name="contactName"
                    :autofocus="true"
                    label="备注名："/>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">完 成</van-button>
            </div>
        </van-form>
    </forward-container>
</template>

<script>
    import {mapGetters} from 'vuex';
    import ForwardContainer from "../../components/forward-container";
    import {editContactRequest, fetchContactDetailRequest} from "../../api/contact";

    export default {
        name: "contact-info-edit",
        components: {ForwardContainer},
        data() {
            return {
                contactData: {}
            }
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        created() {
            const params = {
                userId: this.userInfo.id,
                contactId: this.$route.query.contactId
            }
            fetchContactDetailRequest(params).then(res => {
                if (res.code === 0) {
                    this.contactData = res.data;
                }
            })
        },
        methods: {
            onSubmit() {
                const params = {
                    userId: this.userInfo.id,
                    contactId: this.$route.query.contactId,
                    contactName: this.contactData.contactName
                }
                editContactRequest(params).then(() => {
                    this.$toast.success('修改成功！');
                    history.back();
                }).catch(() => {
                    this.$toast.fail('修改失败！');
                })
            }
        }
    }
</script>

<style scoped>

</style>