<template>
	<view>
		<uni-navbar title="发现" :isBack="false">
			<template slot="right">
				<uni-popover-add></uni-popover-add>
			</template>
		</uni-navbar>
		<uni-list>
			<uni-list-item title="朋友圈" link clickable to="/pages/thought-common/thought-common"
				thumb="/static/img/circle.png"></uni-list-item>
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

		}
	}
</script>

<style>

</style>
