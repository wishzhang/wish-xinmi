<template>
    <div>
        <van-nav-bar
                title="新用户注册"
                left-text="返回"
                left-arrow
                @click-left="onClickLeft"/>
        <van-form style="margin-top: 30px;" @submit="onSubmit">
            <van-field
                    v-model="username"
                    name="username"
                    label="用户名"
                    placeholder="用户名"
                    :rules="[{ required: true, message: '请填写用户名' }]"/>
            <van-field
                    v-model="password"
                    type="password"
                    name="password"
                    label="密码"
                    placeholder="密码"
                    :rules="[{ required: true, message: '请填写密码' }]"/>
            <div style="margin: 16px;">
                <van-button round block type="info" native-type="submit">注册</van-button>
            </div>
        </van-form>
    </div>
</template>

<script>
  import {registerRequest} from "../api/register";

  export default {
    name: "register",
    data() {
      return {
        username: '',
        password: '',
      };
    },
    methods: {
      onClickLeft() {
        history.back();
      },
      onSubmit(values) {
        const params = {
          username: values.username,
          password: values.password
        }
        registerRequest(params).then(() => {
          this.$toast.success('注册成功');
          history.back();
        }).catch(() => {
          this.$toast.fail('注册文案');
        })
      },
    },
  }
</script>

<style scoped lang="scss">
</style>