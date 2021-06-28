import toast from '@/plugins/toast.js'
import {
	serialize,
	validatenull
} from '@/common/util.js'
import {
	getStore
} from '@/common/store.js'

function req(option = {}) {
	let opt = {}

	const globalData = getApp().globalData
	const baseURL = globalData.baseURL
	const tokenHeader = globalData.tokenHeader

	// 合并默认选项
	opt = Object.assign({
		method: 'GET'
	}, option)

	opt.method = opt.method && opt.method.toUpperCase()

	// 设置请求头 token字段, 并且兼容option.headers
	const token = getStore({
		name: 'token'
	})
	opt.header = Object.assign({
		[tokenHeader]: token
	}, opt.headers || {}, opt.header || {})

	// 设置url
	if (!/^http/.test(opt.url)) {
		opt.url = baseURL + opt.url
	}

	// 设置问号参数
	if (!validatenull(opt.params)) {
		const urlParams = serialize(opt.params)
		opt.url += opt.url.indexOf('?') === -1 ?
			`?${urlParams}` :
			`&${urlParams}`
	}

	/**
	 * 封装响应
	 */
	let successFun = opt.success || (() => {})
	let failFun = opt.fail || (() => {})
	let completeFun = opt.complete || (() => {})

	opt.success = function(res) {
		if (res.statusCode === 200) {
			successFun(res.data)
		} else {
			if (res.statusCode === 404) {
				toast(res.data)
			} else if (res.statusCode === 401) {
				toast('请先登录')
				uni.reLaunch({
					url: '/pages/login/login.vue'
				})
			} else if (res.statusCode >= 500) {
				toast(res.data)
			}
			failFun(res.data)
		}
	}

	opt.fail = function(res) {
		failFun(res)
	}

	opt.complete = function(res) {
		completeFun(res)
	}

	// 返回requestTask， 可调用requestTask.abort()，从而中止请求
	return uni.request(opt)
}


/**
 * request仅仅封装成Promise, 主要封装处理在req函数
 */
function request(option = {}) {
	// 这种回调写法，可以得到requestTask对象（包含中止请求功能）
	if (option.success || option.fail || option.complete) {
		return req(option)
	} else {
		return new Promise((resolve, reject) => {
			req({
				...option,
				success(res) {
					resolve(res)
				},
				fail(res) {
					reject(res)
				}
			})
		})
	}
}

export default request
