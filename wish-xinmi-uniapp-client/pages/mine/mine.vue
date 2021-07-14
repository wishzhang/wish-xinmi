<template>
	<uni-index-layout>
		<view class="uni-status-bar"></view>
		<uni-cell-group style="position: relative;overflow: hidden;">
			<uni-cell-item :itemStyle="{height: '240rpx'}" :title="userInfo.username" :label="'信迷号'+userInfo.username"
				to="/pages/mine-info/mine-info">
				<template slot="icon">
					<uni-avatar class="profile-box" size="large" :src="userInfo.avatarUrl"></uni-avatar>
				</template>
			</uni-cell-item>
			<uni-cell-item title="设置" to="/pages/setting/setting"></uni-cell-item>
			<uni-cell-item title="我发的朋友圈" @click="onToMyThought"></uni-cell-item>
		</uni-cell-group>
	</uni-index-layout>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {

			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			onToMineInfo() {
				uni.navigateTo({
					url: '/pages/mine-info/mine-info'
				})
			},
			onToMyThought() {
				this.$navigateTo({
					url: '/pages/thought-people/thought-people',
					params: {
						userId: this.userInfo.userId
					}
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.profile-box {
		margin-left: 20rpx;
		margin-right: $uni-spacing-row-lg;
	}
</style>
