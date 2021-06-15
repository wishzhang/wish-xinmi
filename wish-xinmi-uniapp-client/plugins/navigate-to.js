import {
	serialize,
	validatenull
} from '@/common/util.js'

export default function navigateTo(option) {
	if (!validatenull(option.params)) {
		const urlParams = serialize(option.params)
		option.url += option.url.indexOf('?') === -1 ?
			`?${urlParams}` :
			`&${urlParams}`
	}
	uni.navigateTo(option)
}
