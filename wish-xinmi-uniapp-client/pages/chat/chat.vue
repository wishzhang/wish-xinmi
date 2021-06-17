<template>
	<view id="chat" class="uni-relative chat-box">
		<uni-navbar back-text="000001"></uni-navbar>

		<!-- 用来计算一页的高度 -->
		<view class="chat-list chat-list-tmp" id="tmp-list">
			<view class="chat-list-item tmp-msg" v-for="(msg,ind) in tmpList">
				<view v-show="msg.type==='left'" class="list-item item-your">
					<uni-avatar class="avatar-left" />
					<chat-msg type="left" class="item-msg">{{msg.content}}</chat-msg>
				</view>
				<view v-show="msg.type==='right'" class="list-item item-mine">
					<chat-msg type="right" class="item-msg">{{msg.content}}</chat-msg>
					<uni-avatar class="avatar-right" />
				</view>
			</view>
		</view>

		<view class="chat-list">
			<view class="chat-list-wrap" :style="{height: listHeight}">
				<template v-for="(msg,ind) in list">
					<view :key="'msg_'+ind" :style="{visibility: !(ind>=0&&ind<10&&loadingMore)? 'visible': 'hidden'}"
						class="chat-list-item" :id="'msg_'+ind">
						<view v-show="msg.type==='left'" class="list-item item-your">
							<uni-avatar class="avatar-left" />
							<chat-msg type="left" class="item-msg">{{msg.content}}</chat-msg>
						</view>
						<view v-show="msg.type==='right'" class="list-item item-mine">
							<chat-msg type="right" class="item-msg">{{msg.content}}</chat-msg>
							<uni-avatar class="avatar-right" />
						</view>
					</view>
				</template>
			</view>
		</view>

		<view class="send-box">
			<u-input ref="inputRef" :focus="false" :clearable="false" v-model="content" placeholder="" class="send-input" type="text"
				clearable />
			<view class="send-button" @touchend.prevent="onSend">
				<u-button type="primary" size="medium" :ripple="true" :hair-line="false">发送</u-button>
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
		uuid,
		rpx2px
	} from '@/common/util.js'

	const loadingHeight = rpx2px('126rpx')[0]

	const tmpHeight = rpx2px('10000rpx')[0]

	export default {
		components: {
			ChatMsg
		},
		data() {
			return {
				tmpShow: false,
				tmpList: [],
				tmpRect: [],
				tmpListHeight: 0,

				listHeight: 0,

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
					pageSize: 10,
					currentPage: 1,
					total: 0
				},

				preRect: {},
				curRect: {}
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad(option) {
			console.log('onload')
			this.option = option

			uni.onKeyboardHeightChange(res => {
				if (res.height > 0) {
					this.scrollToBottom()
				}
			})
		},
		mounted() {
			const self = this
			console.log('created')
			this.fetchList().then(async (newList) => {
				const h = await this.calcHeight(newList)
				self.listHeight = h + 'px'

				self.scrollToBottom().then(() => {
					self.pushList(newList)
				})
			})
		},
		onReady() {

		},
		methods: {
			pushList(newList) {
				this.list = [...newList, ...this.list]
			},
			calcHeight(tmpList) {
				const self = this

				self.tmpList = tmpList
				return new Promise((resolve, reject) => {
					self.$nextTick(() => {
						try {
							const query = uni.createSelectorQuery().in(self)
							const tmpMsg = query.selectAll('.tmp-msg')
							tmpMsg.boundingClientRect(data => {
								console.log(data)
								const height = data.reduce((total,
									el) => {
									return total + el.height
								}, 0)
								resolve(height)
							}).exec()
						} catch (e) {
							reject(e)
						}
					})
				})
			},
			onTap() {

			},
			async onSend() {
				if (!this.content.trim()) {
					this.$toast('不能发送空消息')
					return
				}

				await this.pushMessage({
					originUser: this.userInfo.userId,
					targetUser: this.option.userId,
					content: this.content,
					originAvatarUrl: this.userInfo.avatarUrl
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
					let arr = this.convertList(data.records).reverse()
					arr = arr.map(el => {
						el.uuid = uuid()
						return el
					})
					return arr
				})
			},
			pageScrollTo(scrollTop) {
				const self = this
				return new Promise((resolve, reject) => {
					self.$nextTick(function() {
						uni.pageScrollTo({
							scrollTop: scrollTop,
							duration: 0,
							success() {
								console.log('scroll: scrollTop=' + scrollTop)
								resolve()
							},
							fail(err) {
								console.log('scroll: error')
								reject(err)
							}
						})
					})
				})
			},
			onPageScroll(e) {
				this.current.scrollTop = e.scrollTop
			},
			onPullDownRefresh(e) {
				const self = this
		
				this.fetchList()
					.then(async list => {
						const h = await self.calcHeight(list)
						self.listHeight = (Number.parseFloat(self.listHeight) + h) + 'px'

						self.pushList(list)
						this.loadingMore = true

						await self.pageScrollTo(h)
						this.loadingMore = false

						uni.stopPullDownRefresh()
						return self.$nextTick(async function() {


						})
					}).catch(err => {
						uni.stopPullDownRefresh()
					})
			},
			async pushMessage({
				originUser,
				targetUser,
				content,
				originAvatarUrl,
				targetAvatarUrl
			}) {
				const self = this

				let msgObj = {}
				if (originUser === this.userInfo.userId) {
					msgObj = {
						type: 'right',
						content: content,
						avatarUrl: originAvatarUrl
					}
				} else if (targetUser === this.userInfo.userId) {
					msgObj = {
						type: 'left',
						content: content,
						avatarUrl: targetAvatarUrl
					}
				}

				this.content = ''

				self.list.push(msgObj)
				const h = await this.calcHeight([msgObj])
				self.listHeight = (Number.parseFloat(self.listHeight) + h) + 'px'


				this.scrollToBottom().then(() => {

					const params = {
						originUser: this.userInfo.userId,
						targetUser: this.option.userId,
						content: content
					}
					addMessageToContactRequest(params).then(res => {

					}).catch(() => {
						this.$toast('发送失败')
					})
				})
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
				return new Promise((resolve, reject) => {
					self.$nextTick(function() {
						uni.pageScrollTo({
							scrollTop: Number.MAX_SAFE_INTEGER,
							duration: 0,
							success() {
								console.log('success')
								resolve()
							},
							fail(res) {
								console.log(res)
								reject()
							}
						})
					})
				})
			},
			getId(index) {
				return `msg_${index}`
			}
		}
	}
</script>

<style scoped lang="scss">
	$bottom-height: 100rpx;

	.chat-box {}

	.chat-list-wrap {
		padding-top: 36rpx;
		padding-bottom: 100rpx;
		overflow: hidden;
		box-sizing: content-box;
	}

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

	.chat-list-tmp {
		height: 0;
		overflow: hidden;
	}

	.chat-list {
		display: block;
		background-color: #f7f8fa;

		.chat-list-item {
			overflow: hidden;

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
