import request from './request.js'

import {
	getStore
} from '@/common/store.js'

export const addThoughtRequest = (formData) => {
	return request({
		url: '/circle/addThought',
		method: 'post',
		data: formData
	})
}


function parseData(res){
	res.data = JSON.parse(res.data)
}

export const addThoughtForUniappRequest = ({
	content,
	files,
	createUser,
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
		url: baseURL + '/circle/addToughtForUniapp',
		files: files,
		header: {
			[tokenHeader]: token
		},
		formData: {
			content,
			createUser
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

export const fetchPageRequest = (params) => {
	return request({
		url: '/circle/getPage',
		method: 'get',
		params: params
	})
}

export const fetchUserThoughtPageRequest = (params) => {
	return request({
		url: '/circle/getUserThoughtPage',
		method: 'get',
		params: params
	})
}
