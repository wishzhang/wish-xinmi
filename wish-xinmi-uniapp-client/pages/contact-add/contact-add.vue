<template>
	<view>
		<view style="background-color:white;">
			<u-field v-model="value" icon="search" label-width="0" placeholder="请输入信迷号">
				<text slot="right">取消</text>
			</u-field>
			<uni-list :border="true">
				<uni-list-item title="新的朋友">
					<view style="margin-right: 22rpx;" slot="header">
						<uni-avatar></uni-avatar>
					</view>
				</uni-list-item>
			</uni-list>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: ''
			}
		},
		methods: {

		}
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
