export default function toast(option) {
	let opt = {}

	if (typeof option === 'string') {
		opt = {
			title: option,
			icon: 'none',
			position: 'bottom'
		}
	} else {
		opt = Object.assign({
			icon: 'none',
			position: 'bottom'
		}, option)
	}

	if (this && this.$refs !== 'undefined' && this.$refs.uToast) {
		this.$refs.uToast.showToast(opt)
	} else {
		uni.showToast({
			title: opt.title,
			icon: 'none'
		})
	}
}
