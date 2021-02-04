import Vue from 'vue'
import Vuex from 'vuex'
import {getStore, setStore} from "../util/store";
import {loginRequest} from "../api/login";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  getters: {
    userInfo: (state)=>{
      return state.user.userInfo
    }
  },
  modules: {
    user: {
      state: () => {
        return {
          userInfo: getStore({name: 'userInfo'})
        }
      },
      mutations: {
        SET_USER_INFO(state, userInfo) {
          state.userInfo = userInfo;
          setStore({name: 'userInfo', content: userInfo});
        }
      },
      actions: {
        Login({commit}, {username, password}) {
          const params = {
            username: username,
            password: password
          };
          return loginRequest(params).then(res => {
            if(res.code === 0){
              const data = res.data;
              commit('SET_USER_INFO', data);
            }
            return res;
          })
        }
      },
      getters: {
      }
    }
  }
})
