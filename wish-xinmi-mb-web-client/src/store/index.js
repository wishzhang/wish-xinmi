import Vue from 'vue'
import Vuex from 'vuex'
import {getStore, setStore} from "../util/store";
import {fetchUserInfoRequest} from "../api/user";
import {fetchServerTimeRequest} from "@/api/common";

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
        loginType: (state)=>{
            return state.common.loginType
        }
    },
    modules: {
        user: {
            state: {
                userInfo: getStore({name: 'userInfo'}) || {},
                serverTime: undefined
            },
            mutations: {
                SET_USER_INFO(state, userInfo) {
                    state.userInfo = userInfo;
                    setStore({name: 'userInfo', content: userInfo});
                },
                SET_SERVER_TIME(state, serverTime) {
                    state.serverTime = serverTime;
                }
            },
            actions: {
                FetchUserInfo({commit}, userId) {
                    const params = {
                        id: userId
                    }
                    return fetchUserInfoRequest(params).then(res => {
                        if (res.code === 0) {
                            const data = res.data;
                            commit('SET_USER_INFO', data);
                        }
                        return res;
                    })
                },
                Logout({commit}) {
                    commit('SET_USER_INFO', {});
                }
            },
            getters: {}
        },
        common: {
            state: {
                serverTime: undefined,
                // 登录方式
                loginType: getStore({name: 'loginType'}) || 'email'
            },
            mutations: {
                SET_SERVER_TIME(state, serverTime) {
                    state.serverTime = serverTime;
                },
                SET_LOGIN_TYPE(state, typeName) {
                    state.loginType = typeName;
                    setStore({name: 'loginType', content: typeName});
                }
            },
            actions: {
                FetchServerTime({commit}) {
                    return fetchServerTimeRequest().then(res => {
                        if (res.code === 0) {
                            const serverTime = res.data.serverTime;
                            commit('SET_SERVER_TIME', serverTime);
                            return serverTime;
                        }
                    })
                }
            },
            getters: {}
        }
    }
})
