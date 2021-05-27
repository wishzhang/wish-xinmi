/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import {Toast} from 'vant'
import {getStore} from '../util/store'
import router from './index'
import website from '../website'

axios.defaults.baseURL = process.env.VUE_APP_BASE_API

axios.defaults.timeout = 10000

axios.defaults.validateStatus = function (status) {
    return status >= 200 && status <= 500
}

axios.defaults.withCredentials = true

axios.interceptors.request.use(config => {
    const token = getStore({name: 'token'})
    config.headers[website.tokenHeader] = token
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(res => {
    if (res.status === 200) {
        return res.data
    } else if (res.status === 404) {
        return Promise.reject(res.data)
    } else if (res.status === 401) {
        Toast.fail('请先登录')
        router.push({path: '/login'})
    } else if (res.status >= 500) {
        Toast.fail(res.data)
        return Promise.reject(res.data)
    }
}, error => {
    Toast.fail(error.message);
    return Promise.reject(new Error(error))
})

export default axios
