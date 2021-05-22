<template>
    <basic-container>
        <van-nav-bar left-text="联系人">
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

        <!--待验证的联系人-->
        <van-cell value="" center :to="{path: '/index-layout/contact-confirm'}">
            <!-- 使用 title 插槽来自定义标题 -->
            <template #title>
                <span class="custom-title">新的联系人</span>
            </template>
            <template #icon>
                <div style="margin-right: 16px;">
                    <van-badge :dot="contactWarnNumStr!==''">
                        <div class="pretender-image-bg">
                            <i style="position: relative; top: 1px; color: white;font-size: 24px;"
                               class="iconfont iconlianxiren3" dot></i>
                        </div>
                    </van-badge>
                </div>
            </template>
        </van-cell>

        <van-index-bar :index-list="indexList">
            <template v-for="(item) in contactList">
                <template v-if="item.records.length>0">
                    <van-index-anchor
                            :key="item.label"
                            :index="item.label"></van-index-anchor>
                    <van-cell
                            :key="j"
                            center
                            :title="sub.name" value=""
                            v-for="(sub, j) in item.records"
                            @click="onContactItemClick(sub)">
                        <template #icon>
                            <van-image
                                    radius="4"
                                    width="36"
                                    height="36"
                                    :src="sub.avatarUrl|imageAvatar" style="margin: 0 16px 0 0;"/>
                        </template>
                    </van-cell>
                </template>
            </template>
        </van-index-bar>
    </basic-container>

</template>

<script>
    import {mapGetters} from "vuex";
    import {fetchYetContactListRequest} from "../../api/contact";

    export default {
        name: "frame-index-contact",
        data() {
            return {
                contactList: [],
                showPopover: false,
                actions: [{text: "添加朋友", icon: "friends"}],
            };
        },
        computed: {
            ...mapGetters(["userInfo", "contactWarnNumStr"]),
            indexList() {
                return this.contactList.map(el => el.label);
            }
        },
        created() {
            const params = {
                userId: this.userInfo.userId
            };
            fetchYetContactListRequest(params).then(res => {
                this.contactList = res.data;
            });
        },
        methods: {
            onSelect(action) {
                if (action.text === "添加朋友") {
                    this.$router.push({path: "/index-layout/contact-add"});
                }
            },
            onContactItemClick(item) {
                this.$router.push({path: "/index-layout/contact-info-had", query: {userId: item.contactId}});
            }
        }
    };
</script>`

<style scoped lang="less">
    .pretender-image-bg {
        width: 36px;
        height: 36px;
        line-height: 36px;
        background-color: @green;
        text-align: center;
        border-radius: @border-radius-md;
    }
</style>
