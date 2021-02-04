<template>
    <basic-container>
        <van-cell-group>
            <van-cell v-if="userInfo!==null" label="无签名" :title="userInfo.username">
                <template #icon>
                    <van-image
                            radius="4"
                            width="48"
                            height="48"
                            src="/api/img/default-avatar.png" style="margin: 0 8px 0 0;"/>
                </template>
            </van-cell>
        </van-cell-group>

        <van-cell value="设置"
                  is-link
                  :to="{path: '/setting'}"
                  icon="setting-o">
        </van-cell>
        <van-cell value="我的朋友圈"
                  is-link
                  :to="{path: '/thought-people', query: {id: userInfo.id}}"
                  icon="setting-o">
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
  }
</script>

<style scoped>

</style>
