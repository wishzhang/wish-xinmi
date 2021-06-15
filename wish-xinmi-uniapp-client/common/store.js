import {validatenull} from './util.js'

const keyName = 'xinmi'

export const setStore = (params = {}) => {
	let {
		name,
		content,
		type,
	} = params;
	name = keyName + name
	let obj = {
		dataType: typeof(content),
		content: content,
		datetime: new Date().getTime()
	}

	uni.setStorageSync(name, JSON.stringify(obj))
}

export const getStore = (params = {}) => {
	let {
		name,
		debug
	} = params
	name = keyName + name
	let obj = {},
		content

	if (validatenull(obj)) obj = uni.getStorageSync(name)
	if (validatenull(obj)) return
	try {
		obj = JSON.parse(obj)
	} catch {
		return obj
	}
	if (debug) {
		return obj
	}
	if (obj.dataType == 'string') {
		content = obj.content
	} else if (obj.dataType == 'number') {
		content = Number(obj.content)
	} else if (obj.dataType == 'boolean') {
		content = eval(obj.content)
	} else if (obj.dataType == 'object') {
		content = obj.content
	}
	return content
}

export const removeStore = (params = {}) => {
	let {
		name,
		type
	} = params;
	name = keyName + name
	uni.removeStorageSync(name);
}

export const getAllStore = () => {
	let list = [];

	const res = uni.getStorageInfoSync();
	for (let key of res.keys) {
		list.push({
			name: key,
			content: getStore({
				name: key
			})
		})
	}

	return list;
}

export const clearStore = () => {
	uni.clearStorageSync();
}

// module.exports = {
// 	setStore,
// 	getStore,
// 	removeStore,
// 	getAllStore,
// 	clearStore
// }
