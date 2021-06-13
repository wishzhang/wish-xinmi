<template>
	<view class="mine">
		<uni-list :border="true">
			<uni-list-item class="profile-box" title="列表左侧带略缩图" note="列表描述信息"
				thumb="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png"
				thumb-size="lg" link clickable @click="onToMineInfo"></uni-list-item>
			<uni-list-item title="设置" to="/pages/setting/setting" link></uni-list-item>
			<uni-list-item title="我发的朋友圈" link></uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
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

<style>
	.mine{
		background-color: white;
	}
	
	.profile-box {
		padding: 26rpx 0;
	}
</style>
