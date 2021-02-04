<template>
    <basic-container>
        <van-nav-bar
                placeholder
                fixed
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"/>
        <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad">
            <van-cell v-for="item in list" :key="item.id" :label="item.validate_msg" :title="item.username" center>
                <template #right-icon>
                    <van-button
                            :loading="loadingConfirm"
                            type="info"
                            size="mini"
                            @click="onConfirm(item)">接受
                    </van-button>
                </template>
                <template #icon>
                    <van-image
                            radius="4"
                            width="42"
                            height="42"
                            src="/api/img/default-avatar.png" style="margin: 0 8px 0 0;"/>
                </template>
            </van-cell>
        </van-list>
    </basic-container>
</template>

<script>
  import {confirmContactRequest, fetchConfirmContactListRequest} from "../../api/contact";
  import {mapGetters} from 'vuex';

  export default {
    name: "contact-wait",
    data() {
      return {
        list: [],
        loading: false,
        finished: false,
        loadingConfirm: false
      };
    },
    computed: {
      ...mapGetters(['userInfo'])
    },
    methods: {
      onLoad() {
        this.finished = true;
        this.loading = false;
        const params = {
          id: this.userInfo.id
        }
        fetchConfirmContactListRequest(params).then(res => {
          this.list = res.data;
        })
      },
      onClickLeft() {
        history.back();
      },
      onConfirm(item) {
        const params = {
          id: this.userInfo.id,
          contactId: item.id
        }
        this.loadingConfirm = true;
        confirmContactRequest(params).then(res => {
          if (res.code === 0) {
            this.onLoad();
          } else {
            this.$toast.fail('操作失败');
          }
        }).finally(() => {
          this.loadingConfirm = false;
        })
      }
    }
  }
</script>

<style scoped>

</style>