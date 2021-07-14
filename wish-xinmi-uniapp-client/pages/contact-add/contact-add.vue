<template>
	<view class="uni-bg-white">
		<uni-navbar title="添加朋友"></uni-navbar>

		<view>
			<u-field :icon-style="{fontSize: '44rpx', color: $style.uniTipsColor, position: 'relative',top: '1rpx'}"
				:icon-color="$style.uniTipsColor" :clear-size="36" icon="search"
				:placeholder-style="'color:'+$style.uniTipsColor" v-model="value" label-width="0" placeholder="请输入信迷号"
				@input="onValueInput">
			</u-field>

			<uni-cell-group :border="false">
				<template v-for="(item,index) in list">
					<uni-cell-item :key="index" :title="item.username" :arrow="false" clickable
						@click="onToContactPeople(item)">
						<view :style="{marginRight: $style.uniPaddingHorizontal}" slot="icon">
							<uni-avatar size="small" :src="item.avatarUrl"></uni-avatar>
						</view>
					</uni-cell-item>
				</template>
			</uni-cell-group>
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
