<template>
	<view>
		<uni-navbar title="消息" :is-back="false">
			<template slot="right">
				<uni-popover-add></uni-popover-add>
			</template>
		</uni-navbar>

		<uni-list :border="false">
			<uni-list-chat title="uni-app"
				avatar="https://vkceyugu.cdn.bspapp.com/VKCEYUGU-dc-site/460d46d0-4fcc-11eb-8ff1-d5dcf8779628.png"
				note="您收到一条新的消息" time="2020-02-02 20:20" badge-positon="left" badge-text="99"
				@click.native="toChatClick">
			</uni-list-chat>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value1: 1,
				btnList: ['发斯蒂芬阿', '发斯蒂芬阿'],
			}
		},
		methods: {
			toChatClick() {
				uni.navigateTo({
					url: '/pages/chat/chat'
				})
			}
		}
	}
</script>

<style>

</style>
