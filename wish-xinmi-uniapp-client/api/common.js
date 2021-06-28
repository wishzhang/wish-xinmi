import request from './request.js'

import {
	getStore
} from '@/common/store.js'

export const putFile = (file) => {
	const formData = new FormData()
	formData.set('file', file)
	return request({
		url: '/file/put',
		method: 'post',
		data: formData,
		headers: {
			'Content-Type': 'multipart/form-data'
		}
	})
}

function parseData(res){
	res.data = JSON.parse(res.data)
}

export const putFileForUniapp = ({
	file,
	success,
	fail,
	complete
}) => {
	const globalData = getApp().globalData
	const baseURL = globalData.baseURL
	const tokenHeader = globalData.tokenHeader

	const token = getStore({
		name: 'token'
	})

	return uni.uploadFile({
		url: baseURL + '/file/put', //仅为示例，非真实的接口地址
		file: file,
		name: 'file',
		header: {
			[tokenHeader]: token
		},
		success: (res) => {
			parseData(res)
			success(res.data)
		},
		fail: (res) => {
			fail(res)
		},
		complete: (res) => {
			complete(res)
		}
	})
}

export const fetchServerTimeRequest = () => {
	return request({
		url: '/common/serverTime',
		method: 'get'
	})
}
