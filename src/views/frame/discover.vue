<template>
    <basic-container>
        <van-nav-bar left-text="发现">
            <template #right>
                <van-popover
                        v-model="showPopover"
                        trigger="click"
                        :actions="actions"
                        :offset="[10,10]"
                        theme="dark"
                        placement="bottom-end"
                        @select="onSelect">
                    <template #reference>
                        <van-icon name="add-o" size="20" style="position: relative;top: 4px;"/>
                    </template>
                </van-popover>
            </template>
        </van-nav-bar>
        <van-cell title="朋友圈" center is-link :to="{path: '/index-layout/thought'}">
            <template #icon>
                <van-image
                        width="22"
                        height="22"
                        style="margin-right:3px;"
                        src="/img/circle.png"/>
            </template>
        </van-cell>
    </basic-container>

</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "discover",
        data() {
            return {
                contactList: [],
                showPopover: false,
                actions: [{text: '添加朋友', icon: 'friends'}],
            }
        },
        computed: {
            ...mapGetters(['userInfo']),
            indexList() {
                return this.contactList.map(el => el.label);
            }
        },
        created() {

        },
        methods: {
            onSelect(action) {
                if (action.text === '添加朋友') {
                    this.$router.push({path: '/index-layout/contact-add'})
                }
            }
        }
    }
</script>

<style scoped>

</style>
