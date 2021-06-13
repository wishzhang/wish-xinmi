<template>
	<view>
		<u-navbar back-text="000001"></u-navbar>
		<view class="chat-list">
			<view class="chat-list-item" :key="ind" v-for="(msg,ind) in list">
				<template v-if="msg.type==='left'">
					<view class="list-item item-your">
						<uni-avatar style="margin: 0 8px 0 12px;" />
						<chat-msg type="left" class="item-msg">{{msg.content}}</chat-msg>
					</view>
				</template>
				<template v-else-if="msg.type==='right'">
					<view class="list-item item-mine">
						<chat-msg type="right" class="item-msg">{{msg.content}}</chat-msg>
						<uni-avatar style="margin: 0 12px 0 8px;" />
					</view>
				</template>
			</view>
		</view>

		<view class="send-box">
			<u-input focus class="send-input" v-model="content" type="text" clearable/>
			<u-button class="send-button" type="primary" size="medium">发送</u-button>
		</view>
	</view>
</template>

<script>
	import ChatMsg from '@/components/uni-chat-msg/uni-chat-msg.vue';
	const ll = [{
			"messageId": "5d09ed20-c8cb-11eb-8dc6-89c97cef975d",
			"originUser": "07444a80-c01e-11eb-b468-d163dc5e9290",
			"chatId": "25584430-c8cb-11eb-8dc6-89c97cef975d",
			"content": "21",
			"isChecked": "1",
			"createdAt": "2021-06-09 02:35:32",
			"updatedAt": "2021-06-09 03:45:46",
			"deletedAt": null,
			"originName": "00002",
			"originAvatarUrl": "/xinmi-minio/ab53f490-c01e-11eb-b468-d163dc5e9290.jpg",
			"targetUser": "c1dea880-bfb6-11eb-a175-bd6bf69212cf",
			"targetAvatarUrl": null,
			"targetName": "00001"
		},
		{
			"messageId": "3895f4c0-c8cb-11eb-8dc6-89c97cef975d",
			"originUser": "07444a80-c01e-11eb-b468-d163dc5e9290",
			"chatId": "25584430-c8cb-11eb-8dc6-89c97cef975d",
			"content": "6",
			"isChecked": "1",
			"createdAt": "2021-06-09 02:34:31",
			"updatedAt": "2021-06-09 03:45:46",
			"deletedAt": null,
			"originName": "00002",
			"originAvatarUrl": "/xinmi-minio/ab53f490-c01e-11eb-b468-d163dc5e9290.jpg",
			"targetUser": "c1dea880-bfb6-11eb-a175-bd6bf69212cf",
			"targetAvatarUrl": null,
			"targetName": "00001"
		},
		{
			"messageId": "32fe8770-c8cb-11eb-8dc6-89c97cef975d",
			"originUser": "07444a80-c01e-11eb-b468-d163dc5e9290",
			"chatId": "25584430-c8cb-11eb-8dc6-89c97cef975d",
			"content": "5",
			"isChecked": "1",
			"createdAt": "2021-06-09 02:34:22",
			"updatedAt": "2021-06-09 03:45:46",
			"deletedAt": null,
			"originName": "00002",
			"originAvatarUrl": "/xinmi-minio/ab53f490-c01e-11eb-b468-d163dc5e9290.jpg",
			"targetUser": "c1dea880-bfb6-11eb-a175-bd6bf69212cf",
			"targetAvatarUrl": null,
			"targetName": "00001"
		}
	];

	export default {
		components: {
			ChatMsg
		},
		data() {
			return {
				list: [],
				content: ''
			}
		},
		onLoad() {
			this.list = this.convertList(ll).reverse()
			console.dir(this.list)
			// uni.request({
			// 	url: 'https://www.example.com/request', //仅为示例，并非真实接口地址。
			// 	data: {
			// 		text: 'uni.request'
			// 	},
			// 	header: {
			// 		'custom-header': 'hello' //自定义请求头信息
			// 	},
			// 	success: (res) => {
			// 		this.text = 'request success'
			// 	}
			// });
		},
		methods: {
			convertList(list = []) {
				const arr = list.map(el => {
					if (el.originUser === '07444a80-c01e-11eb-b468-d163dc5e9290') {
						return {
							type: 'right',
							content: el.content,
							avatarUrl: el.originAvatarUrl
						}
					} else {
						return {
							type: 'left',
							content: el.content,
							avatarUrl: el.targetAvatarUrl
						}
					}
				});
				return arr;
			},
		}
	}
</script>

<style scoped lang="scss">
	.chat-list {
		padding-bottom: 60px;
		background-color: #f7f8fa;

		.chat-list-item {
			.list-item {
				width: 100%;
				display: flex;
				margin: 12px 0;
				box-sizing: border-box;

				&.item-your {
					justify-content: flex-start;
					padding-right: 66px;

					.item-avatar {
						margin-left: 14px;
					}
				}

				&.item-mine {
					justify-items: flex-end;
					padding-left: 66px;

					.item-avatar {
						margin-right: 14px;
					}
				}

				.item-avatar {
					width: 40px;
					height: 40px;
					border-radius: 3px;
				}

				.item-msg {
					flex: 1;
				}

			}
		}
	}

	.send-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		background-color: white;
		width:100%;
		padding: 16rpx $uni-padding-horizontal;
		border-top: 1rpx solid $uni-border-color;

		.send-input {
			flex: 1;
		}

		.send-button {
			margin-left: 20rpx;
		}
	}
</style>
