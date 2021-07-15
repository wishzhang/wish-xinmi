<template>
	<uni-index-layout>
		<uni-navbar :title="contactDetail.name"></uni-navbar>

		<mescroll-body ref="mescrollRef" bottom="100rpx" @init="mescrollInit" :up="upOption" :down="downOption"
			@down="downCallback">
			<u-loadmore v-if="isEnd" status="nomore" class="no-more" />

			<view class="list-item" :key="msg.VIEW_ID" :id="msg.VIEW_ID" :class="['item-'+msg.type]"
				v-for="(msg,ind) in list">
				<uni-avatar v-show="msg.type==='left'" class="avatar-left" size="small" @click="onToPeopleInfo(msg)" />
				<chat-msg :type="msg.type" class="item-msg">{{msg.content}}</chat-msg>
				<uni-avatar v-show="msg.type==='right'" class="avatar-right" size="small"
					@click="onToPeopleInfo(msg)" />
			</view>
		</mescroll-body>

		<view class="send-box">
			<u-input ref="inputRef" :focus="false" :clearable="false" v-model="content" placeholder="" :height="36"
				type="textarea" :custom-style="{padding: `${$style.uniSpacingColBase} ${$style.uniSpacingRowBase}`}"
				:maxlength="2000" class="send-input" />
			<view class="send-button" @touchend.prevent="onSend">
				<u-button type="primary" size="medium" :ripple="true" :hair-line="false">发送</u-button>
			</view>
		</view>

	</uni-index-layout>

</template>

<script>
	import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";

	import {
		mapGetters
	} from 'vuex'
	import {
		fetchContactDetailRequest
	} from '@/api/contact.js'
	import {
		checkMessageRequest,
		fetchContactMessagePageRequest,
		addMessageToContactRequest
	} from '@/api/message.js'
	import ChatMsg from '@/components/uni-chat-msg/uni-chat-msg.vue'
	import {
		rpx2px,
		uuid
	} from '@/common/util.js'
	import {
		socket
	} from '@/common/socket.js'

	const loadingHeight = rpx2px('126rpx')[0]

	const tmpHeight = rpx2px('10000rpx')[0]

	export default {
		mixins: [MescrollMixin], // 使用mixin
		components: {
			ChatMsg
		},
		data() {
			return {
				downOption: {
					autoShowLoading: true, // 显示下拉刷新的进度条
					textColor: this.$style.uniTipsColor
				},
				upOption: {
					use: false, // 禁止上拉
					toTop: {
						src: '' // 不显示回到顶部按钮
					}
				},
				isEnd: false, // 是否无消息

				list: [],
				content: '',
				option: {},
				page: {
					pageSize: 16,
					currentPage: 1,
					total: 0
				},

				// 联系人详情
				contactDetail: {}
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad(option) {
			debugger
			
			uni.showLoading()
			this.option = option

			uni.onKeyboardHeightChange(res => {
				if (res.height > 0) {
					this.mescroll.scrollTo(99999, 0)
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
		onUnload() {
			const params = {
				userId: this.userInfo.userId,
				contactId: this.option.userId
			};
			checkMessageRequest(params).then(() => {
			
			}).catch(() => {

			})
		},
		mounted() {
			const self = this
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
		onShow() {},
		methods: {
			downCallback() {
				//联网加载数据
				this.fetchList().then(data => {
					// 先隐藏下拉刷新的状态
					this.mescroll.endSuccess();
					// 不满一页,说明已经无更多消息 (建议根据您实际接口返回的总页码数,总消息量,是否有消息的字段来判断)
					if (data.length < this.page.pageSize) {
						this.isEnd = true; // 标记已无更多消息
						this.mescroll.lockDownScroll(true); // 锁定下拉
					}
					// 生成VIEW_ID,大写,避免污染源数据
					data.forEach(val => {
						val.VIEW_ID = this.generateId() // 不以数字开头
					})

					// 获取当前最顶部的VIEW_ID (注意是写在data.concat前面)
					let topMsg = this.list[0]

					//设置列表数据
					this.list = data.concat(this.list); // 注意不是this.msgList.concat

					this.$nextTick(() => {
						if (this.page.currentPage <= 2) {
							// 第一页直接滚动到底部 ( this.pageNum已在前面加1 )
							this.mescroll.scrollTo(99999, 0)
						} else if (topMsg) {
							// 保持顶部消息的位置
							let view = uni.createSelectorQuery().select('#' + topMsg.VIEW_ID);
							view.boundingClientRect(v => {
								console.log("节点离页面顶部的距离=" + v.top);
								this.mescroll.scrollTo(v.top - 100, 0) // 减去上偏移量100
							}).exec();
						}
					})

				}).catch(() => {
					this.page.currentPage--; // 联网失败,必须回减页码
					this.mescroll.endErr(); // 隐藏下拉刷新的状态
				})
			},

			onToPeopleInfo(msg) {
				this.$navigateTo({
					url: '/pages/contact-friend/contact-friend',
					params: {
						userId: msg.userId
					}
				})
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
					avatarUrl: originAvatarUrl,
					VIEW_ID: this.generateId()
				}

				this.content = ''

				self.list.push(msgObj)

				this.scrollToBottom()
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
				this.$nextTick(function() {
					this.mescroll.scrollTo(99999, 0)
				})
			},
			generateId() {
				return `msg_` + uuid()
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

	.no-more {
		text-align: center;
		height: 90rpx;
		line-height: 90rpx;
	}

	.list-item {
		width: 100%;
		display: flex;
		margin-bottom: 26rpx;
		box-sizing: border-box;

		&.item-left {
			justify-content: flex-start;
			padding-right: 132rpx;
		}

		&.item-right {
			justify-items: flex-end;
			padding-left: 132rpx;
		}

		.item-msg {
			flex: 1;
		}
	}

	.send-box {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: flex-end;
		width: 100%;
		border-top: 1rpx solid $uni-border-color;
		overflow: hidden;
		padding: $uni-spacing-col-base $uni-padding-horizontal $uni-spacing-col-base $uni-padding-horizontal+10rpx;
		background-color: $uni-bg-color;

		.send-input {
			flex: 1;
			background-color: white;
			border-radius: $uni-border-radius-base;
		}

		.send-button {
			margin-left: 20rpx;
		}
	}
</style>
