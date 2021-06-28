<template>
	<view class="uni-page-white">
		<uni-list :border="true">
			<uni-list-item class="profile-box" :title="userInfo.username" :note="'信迷号'+userInfo.username" link clickable
				@click="onToMineInfo">
				<view style="margin-right: 22rpx;" slot="header">
					<uni-avatar :src="userInfo.avatarUrl"></uni-avatar>
				</view>
			</uni-list-item>

			<uni-list-item title="设置" to="/pages/setting/setting" link></uni-list-item>
			<uni-list-item title="我发的朋友圈" link></uni-list-item>
		</uni-list>
	</view>
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
			}
		}
	}
</script>

<style scoped>
	.profile-box {
		padding: 26rpx 0;
	}
</style>
