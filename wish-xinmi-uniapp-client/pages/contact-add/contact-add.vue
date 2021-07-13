<template>
	<view class="uni-bg-white">
		<uni-navbar title="添加朋友"></uni-navbar>

		<view>
			<u-field v-model="value" icon="search" label-width="0" placeholder="请输入信迷号" @input="onValueInput">
				<text slot="right">取消</text>
			</u-field>

			<uni-list :border="true">
				<template v-for="(item,index) in list">
					<uni-list-item :key="index" :title="item.username" clickable @click="onToContactPeople(item)">
						<view style="margin-right: 22rpx;" slot="header">
							<uni-avatar :src="item.avatarUrl"></uni-avatar>
						</view>
					</uni-list-item>
				</template>
			</uni-list>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		fetchNoContactListRequest
	} from '@/api/contact.js'

	export default {
		data() {
			return {
				value: '',
				list: []
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			onToContactPeople(item) {
				this.$navigateTo({
					url: '/pages/contact-people/contact-people',
					params: {
						userId: item.userId
					}
				})
			},
			onValueInput() {
				this.fetchData()
			},
			fetchData() {
				const params = {
					userId: this.userInfo.userId,
					username: this.value
				}
				fetchNoContactListRequest(params).then(res => {
					this.list = res.data
				})
			}
		},

	}
</script>

<style scoped lang="scss">
	/deep/ {
		.uni-list-item__content-title,
		.uni-list-chat__content-title {
			position: relative;
			top: 24rpx;
		}
	}
</style>
