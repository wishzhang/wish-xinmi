<template>
	<view>
		<view v-if="type==='left'" class="chat-bubble chat-bubble-left">
			<slot />
		</view>
		<view v-else-if="type==='right'" class="chat-bubble chat-bubble-right">
			<slot />
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			type: {
				type: String,
				required: true
			}
		}
	}
</script>

<style scoped lang="scss">
	.chat-bubble {
		position: relative;
		padding: 9px 10px;
		word-break: break-all;
		background: #fff;
		border-radius: 4px;
		min-height: 36px;
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}

	.chat-bubble-left {
		margin-left: 6px;
	}

	.chat-bubble-left:after {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		left: -16px;
		top: 7px;
		border: 8px solid;
		border-color: transparent #ffffff transparent transparent;
	}

	.chat-bubble-right {
		margin-right: 6px;
		background-color:$u-type-primary-light;
	}

	.chat-bubble-right:after {
		content: '';
		position: absolute;
		width: 0;
		height: 0;
		right: -16px;
		top: 7px;
		border: 8px solid;
		border-color: transparent transparent transparent $u-type-primary-light;
	}
</style>
