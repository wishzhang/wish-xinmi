<template>
	<uni-index-layout>
		<uni-navbar :back-text="contactDetail.name"></uni-navbar>

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

		<!-- 加载 -->
		<view class="load-more" v-show="loadingMore">
			<u-loading :show="loadingMore" mode="circle"></u-loading>
		</view>

		<view class="chat-list">
			<view class="chat-list-wrap" :style="{height: listHeight}">
				<template v-for="(msg,ind) in list">
					<view :key="'msg_'+ind" :style="{visibility: !(ind>=0&&ind<10&&lock)? 'visible': 'hidden'}"
						class="chat-list-item" :id="'msg_'+ind">
						<view v-show="msg.type==='left'" class="list-item item-your">
							<uni-avatar class="avatar-left" @click="onToPeopleInfo(msg)" />
							<chat-msg type="left" class="item-msg">{{msg.content}}</chat-msg>
						</view>
						<view v-show="msg.type==='right'" class="list-item item-mine">
							<chat-msg type="right" class="item-msg">{{msg.content}}</chat-msg>
							<uni-avatar class="avatar-right" @click="onToPeopleInfo(msg)" />
						</view>
					</view>
				</template>
			</view>
		</view>

		<view class="send-box">
			<u-input ref="inputRef" :focus="false" :clearable="false" v-model="content" placeholder=""
				class="send-input" type="text" clearable />
			<view class="send-button" @touchend.prevent="onSend">
				<u-button type="primary" size="medium" :ripple="true" :hair-line="false">发送</u-button>
			</view>
		</view>

	</uni-index-layout>

</template>

<script>
	/**
	 * 当scrollTop为0，那么触发，然后防止触发标志。但更新后解锁触发标志。
	 * 当loadEnd为true则锁死
	 */

	import {
		mapGetters
	} from 'vuex'
	import {
		fetchContactDetailRequest
	} from '@/api/contact.js'
	import {
		fetchContactMessagePageRequest,
		addMessageToContactRequest
	} from '@/api/message.js'
	import ChatMsg from '@/components/uni-chat-msg/uni-chat-msg.vue'
	import {
		rpx2px
	} from '@/common/util.js'
	import {
		socket
	} from '@/common/socket.js'

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
				lock: false,
				loadingMore: false,
				loadEnd: false,
				scrollTop: 0,
				current: {
					scrollTop: 0
				},

				list: [],
				content: '',
				option: {},
				page: {
					pageSize: 16,
					currentPage: 1,
					total: 0
				},

				preRect: {},
				curRect: {},

				// 联系人详情
				contactDetail: {}
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad(option) {
			uni.showLoading()
			this.option = option

			uni.onKeyboardHeightChange(res => {
				if (res.height > 0) {
					this.scrollToBottom()
				}
			})

			// 获取联系人详情
			const params = {
				userId: this.userInfo.userId,
				contactId: this.option.userId
			}
			fetchContactDetailRequest(params).then(res => {
				this.contactDetail = res.data
			}).finally(() => {
				uni.hideLoading()
			})
		},
		mounted() {
			const self = this
			this.fetchList().then(async (newList) => {
				const h = await this.calcHeight(newList)
				self.listHeight = h + 'px'

				self.scrollToBottom().then(() => {
					self.pushList(newList)
				})
			})

			// 监听socket
			console.log(socket)
			if (socket) {
				socket.on('message-one-contact', data => {
					console.log(data);
					this.showOneMessage(data)
				})
			}
		},
		onReady() {},
		onShow() {
			this.scrollToBottom()
		},
		methods: {
			onToPeopleInfo(msg) {
				this.$navigateTo({
					url: '/pages/contact-friend/contact-friend',
					params: {
						userId: msg.userId
					}
				})
			},
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
								resolve()
							},
							fail(err) {
								reject(err)
							}
						})
					})
				})
			},
			onPageScroll(e) {
				if (e.scrollTop < 0 + 5 && !this.loadingMore) {
					this.loadingMore = true
					this.loadMore()
				}
				this.current.scrollTop = e.scrollTop
			},
			onPullDownRefresh(e) {
				this.loadMore()
			},
			loadMore() {
				const self = this

				this.fetchList()
					.then(async list => {
						const h = await self.calcHeight(list)
						self.listHeight = (Number.parseFloat(self.listHeight) + h) + 'px'

						self.pushList(list)
						this.lock = true

						await self.pageScrollTo(h)
						this.lock = false
					}).catch(err => {

					}).finally(() => {
						this.loadingMore = false
					})
			},
			// 发送消息
			async pushMessage(data) {
				this.showOneMessage(data)

				const params = {
					originUser: this.userInfo.userId,
					targetUser: this.option.userId,
					content: data.content
				}
				addMessageToContactRequest(params).then(res => {

				}).catch(() => {
					this.$toast('发送失败')
				})
			},
			async showOneMessage({
				originUser,
				targetUser,
				content,
				originAvatarUrl,
				targetAvatarUrl
			}) {
				const self = this

				let msgObj = {
					userId: originUser,
					type: originUser === this.userInfo.userId ? 'right' : 'left',
					content: content,
					avatarUrl: originAvatarUrl
				}

				this.content = ''

				self.list.push(msgObj)
				const h = await this.calcHeight([msgObj])
				self.listHeight = (Number.parseFloat(self.listHeight) + h) + 'px'

				return await this.scrollToBottom()
			},
			convertList(list = []) {
				const arr = list.map(el => {
					return {
						userId: el.originUser,
						type: el.originUser === this.userInfo.userId ? 'right' : 'left',
						content: el.content,
						avatarUrl: el.originUser === this.userInfo.userId ?
							el.originAvatarUrl : el.targetAvatarUrl
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
								resolve()
							},
							fail(res) {
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

	/* 加载更多 */
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
