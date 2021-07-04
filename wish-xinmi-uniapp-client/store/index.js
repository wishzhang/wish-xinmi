import Vue from 'vue'
import Vuex from 'vuex'
import {
	getStore,
	setStore
} from '@/common/store.js'

import {
	fetchServerTimeRequest
} from '@/api/common.js'
import {
	fetchContactWarnNumRequest
} from '@/api/contact.js'
import {
	fetchMineAllChatListRequest
} from '@/api/message.js'
import style from '@/common/style.js'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {},
	mutations: {},
	actions: {},
	getters: {
		userInfo: (state) => {
			return state.user.userInfo
		},
		serverTime: (state) => {
			return state.common.serverTime
		},
		loginType: (state) => {
			return state.common.loginType
		},
		contactWarnNumStr: (state) => {
			return state.common.contactWarnNum
		},
		chatList: (state) => {
			return state.common.chatList
		},
		unreadMessageCount: (state, getters) => {
			let total = getters.chatList.reduce((total, chat) => {
				return total + chat.unreadCount
			}, 0)
			return total
		},
		tabbar: () => {
			return {
				list: [{
						selectedIconPath: "xiaoxiintouch01",
						iconPath: 'xiaoxiintouch01',
						customPrefix: "xinmi-icon",
						text: '消息',
						count: 2,
						isDot: true,
						pagePath: "/pages/msg/msg"
					},
					{
						selectedIconPath: "renshu",
						iconPath: 'renshu',
						customPrefix: "xinmi-icon",
						text: '联系人',
						count: 2,
						isDot: true,
						pagePath: "/pages/contact/contact"
					},
					{
						selectedIconPath: "faxian",
						iconPath: 'faxian',
						customPrefix: "xinmi-icon",
						text: '发现',
						pagePath: "/pages/thought/thought"
					},
					{
						selectedIconPath: "renyuan",
						iconPath: 'renyuan',
						customPrefix: "xinmi-icon",
						text: '我的',
						pagePath: "/pages/mine/mine"
					}
				],
				iconSize: 44,
				activeColor: style.uniColorPrimary,
				inactiveColor: style.uniTipsColor,
				height: 106
			}
		}
	},
	modules: {
		user: {
			state: {
				userInfo: getStore({
					name: 'userInfo'
				}) || {},
				serverTime: undefined,
				token: getStore({
					name: 'token'
				}) || {}
			},
			mutations: {
				SET_TOKEN(state, token) {
					state.token = token
					setStore({
						name: 'token',
						content: token
					})
				},
				SET_USER_INFO(state, userInfo) {
					state.userInfo = userInfo
					setStore({
						name: 'userInfo',
						content: userInfo
					})
				},
				SET_SERVER_TIME(state, serverTime) {
					state.serverTime = serverTime
				}
			},
			actions: {
				Logout({
					commit
				}) {
					commit('SET_USER_INFO', {})
					commit('SET_TOKEN', '')
					commit('SET_CONTACT_WARN_NUM', 0)
					commit('SET_CHAT_LIST', [])
				}
			},
			getters: {}
		},
		common: {
			state: {
				serverTime: undefined,
				// 登录方式
				loginType: getStore({
					name: 'loginType'
				}) || 'email',
				contactWarnNum: getStore({
					name: 'contactWarnNum'
				}),
				chatList: getStore({
					name: 'chatList'
				}) || []
			},
			mutations: {
				SET_SERVER_TIME(state, serverTime) {
					state.serverTime = serverTime
				},
				SET_LOGIN_TYPE(state, typeName) {
					state.loginType = typeName
					setStore({
						name: 'loginType',
						content: typeName
					})
				},
				SET_CONTACT_WARN_NUM(state, num) {
					num = Number.parseInt(num)
					let str = num >= 1 ? num + '' : ''
					state.contactWarnNum = str
					setStore({
						name: 'contactWarnNum',
						content: str
					})
				},
				SET_CHAT_LIST(state, list) {
					state.chatList = list
					setStore({
						name: 'chatList',
						content: list
					})
				}
			},
			actions: {
				FetchServerTime({
					commit
				}) {
					return fetchServerTimeRequest().then(res => {
						if (res.code === 0) {
							const serverTime = res.data.serverTime
							commit('SET_SERVER_TIME', serverTime)
							return serverTime
						}
					})
				},
				FetchRefreshInitData({
					dispatch,
					state,
					commit,
					rootState
				}) {
					// dispatch('FetchContactWarnNum');
				},
				FetchContactWarnNum({
					dispatch,
					state,
					commit,
					rootState
				}) {
					const params = {
						userId: rootState.user.userInfo.userId
					}
					return fetchContactWarnNumRequest(params).then(res => {
						commit('SET_CONTACT_WARN_NUM', res.data)
					})
				},
				FetchMineAllChatList({
					dispatch,
					state,
					commit,
					rootState
				}) {
					const params = {
						userId: rootState.user.userInfo.userId
					}
					return fetchMineAllChatListRequest(params).then(res => {
						commit('SET_CHAT_LIST', res.data)
					})
				},
			},
			getters: {}
		}
	}
})
