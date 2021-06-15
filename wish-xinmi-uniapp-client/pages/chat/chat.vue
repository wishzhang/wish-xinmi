<template>
	<view id="chat" class="uni-height-full">
		<uni-navbar back-text="000001"></uni-navbar>

		<view v-show="loadingMore" class="load-more">
			<u-loading :show="true" :size="36" mode="circle"></u-loading>
		</view>

		<scroll-view :scroll-into-view="curScrollIntoView" :scroll-top="scrollTop" scroll-y="true" class="scroll-Y"
			@scroll="onScroll" @scrolltoupper="onScrolltoupper">
			<view class="chat-list">

				<view class="chat-list-item" :id="'msg_'+ind" v-for="(msg,ind) in list">
					<view v-if="msg.type==='left'" class="list-item item-your">
						<uni-avatar class="avatar-left" />
						<chat-msg type="left" class="item-msg">{{msg.content}}</chat-msg>
					</view>
					<view v-else-if="msg.type==='right'" class="list-item item-mine">
						<chat-msg type="right" class="item-msg">{{msg.content}}</chat-msg>
						<uni-avatar class="avatar-right" />
					</view>

				</view>

			</view>
		</scroll-view>

		<view class="send-box">
			<u-input cursor-spacing='20px' selection-start='30px' ref="inputRef" :focus="false" v-model="content"
				placeholder="" class="send-input" type="text" clearable />
			<view class="send-button" @touchstart.prevent="onSend">
				<u-button type="primary" size="mini">发送</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import {
		fetchContactMessagePageRequest,
		addMessageToContactRequest
	} from '@/api/message.js'
	import ChatMsg from '@/components/uni-chat-msg/uni-chat-msg.vue'
	import {
		rpx2px
	} from '@/common/util.js'

	const loadingHeight = rpx2px('126rpx')[0]

	export default {
		components: {
			ChatMsg
		},
		data() {
			return {
				curScrollIntoView: '',
				loadingMore: false,
				scrollTop: 0,
				current: {
					scrollTop: 0
				},

				list: [],
				content: '',
				option: {},
				page: {
					pageSize: 15,
					currentPage: 1,
					total: 0
				}
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad(option) {
			console.log('onload')
			this.option = option

			uni.onKeyboardHeightChange(res => {
				console.log(res)
				if (res.height > 0) {
					this.scrollToBottom()
				}
			})

			uni.onWindowResize((res) => {
				console.log('变化后的窗口宽度=' + res.size.windowWidth)
				console.log('变化后的窗口高度=' + res.size.windowHeight)
			})
		},
		created() {
			console.log('created')
			this.fetchList().then(() => {
				this.scrollToBottom()
			})
		},
		onReady() {

		},
		methods: {
			onTap() {

			},
			onSend() {
				if (!this.content.trim()) {
					this.$toast('不能发送空消息')
					return
				}

				this.pushMessage({
					originUser: this.userInfo.userId,
					targetUser: this.option.userId,
					content: this.content,
					originAvatarUrl: this.userInfo.avatarUrl
				})

				this.scrollToBottom()

				const params = {
					originUser: this.userInfo.userId,
					targetUser: this.option.userId,
					content: this.content
				}
				addMessageToContactRequest(params).then(res => {
					this.content = ''
				}).catch(() => {
					this.$toast('发送失败')
				})
			},
			// 分页获取消息
			fetchList() {
				if (this.list.length >= this.page.total && this.list.length !== 0) {
					return Promise.resolve([])
				}
				const params = {
					current: this.page.currentPage++,
					size: this.page.pageSize,
					originUser: this.userInfo.userId,
					targetUser: this.option.userId
				}

				return fetchContactMessagePageRequest(params).then(res => {
					const data = res.data
					this.page.total = data.total
					const arr = this.convertList(data.records)
					this.list = [...arr.reverse(), ...this.list]
					this.scrollToBottom()
					return arr
				})
			},
			onPageScroll(e) {
				console.log(e)
			},
			pushMessage({
				originUser,
				targetUser,
				content,
				originAvatarUrl,
				targetAvatarUrl
			}) {
				if (originUser === this.userInfo.userId) {
					this.list.push({
						type: 'right',
						content: content,
						avatarUrl: originAvatarUrl
					})
				} else if (targetUser === this.userInfo.userId) {
					this.list.push({
						type: 'left',
						content: content,
						avatarUrl: targetAvatarUrl
					})
				}
			},
			convertList(list = []) {
				const arr = list.map(el => {
					if (el.originUser === this.userInfo.userId) {
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
			scrollToBottom() {
				const self = this
				if (this.list.length > 0) {
					this.scrollTop = this.current.scrollTop
					this.$nextTick(function() {
						self.scrollTop = Number.MAX_SAFE_INTEGER
					})
				}
			},
			onScroll(e) {
				this.current.scrollTop = e.detail.scrollTop
			},
			onScrolltoupper() {
				// const self = this

				// if (this.loadingMore && this.list.length >= this.page.total) {
				// 	return
				// }

				// this.loadingMore = true

				// this.fetchList().then(list => {
				// 	let old = ''
				// 	if (list.length > 0) {
				// 		old = 'msg_' + (list.length)
				// 	}
				// 	this.loadingMore = false

				// 	self.$nextTick(() => {
				// 		self.curScrollIntoView = old
				// 		console.log(self.current.scrollTop, loadingHeight)
				// 		self.scrollTop = self.current.scrollTop
				// 		self.$nextTick(() => {
				// 			console.log(self.current.scrollTop, loadingHeight)
				// 			self.scrollTop = self.current.scrollTop - loadingHeight
				// 		})
				// 	})
				// })
			},
			getId(index) {
				return `msg_${index}`
			}
		}
	}
</script>

<style scoped lang="scss">
	$bottom-height: 100rpx;

	.avatar-left {
		margin: 0 8px 0 12px;
	}

	.avatar-right {
		margin: 0 12px 0 8px;
	}

	.load-more {
		text-align: center;
		height: 90rpx;
		line-height: 90rpx;
	}

	/* scroll-view需要设置高度 */
	.scroll-Y {
		height: calc(100% - 100rpx);
	}

	.chat-list {
		display: block;
		padding-top: 36rpx;
		padding-bottom: 100rpx;
		background-color: #f7f8fa;

		.chat-list-item {
			.list-item {
				width: 100%;
				display: flex;
				margin-bottom: 26rpx;
				box-sizing: border-box;

				&.item-your {
					justify-content: flex-start;
					padding-right: 132rpx;
				}

				&.item-mine {
					justify-items: flex-end;
					padding-left: 132rpx;
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
		width: 100%;
		height: $bottom-height;
		border-top: 1rpx solid $uni-border-color;
		overflow: hidden;
		padding: 0 $uni-padding-horizontal 0 $uni-padding-horizontal+10rpx;

		.send-input {
			flex: 1;
		}

		.send-button {
			margin-left: 20rpx;
		}
	}
</style>
