module.exports = function(Vue) {
	Vue.prototype.$showToast = function(option) {
		let opt = {}

		if (typeof option === 'string') {
			opt = {
				title: option,
				icon: 'none',
				position: 'bottom'
			}
		} else {
			opt = Object.assign(option, {
				icon: 'none',
				position: 'bottom'
			})
		}

		// 给编码人提醒
		if (typeof this.$refs.uToast === 'undefined') {
			uni.showToast({
				title: 'this.$refs.uToast is undefined',
				icon: 'none'
			})
		} else {
			this.$refs.uToast.showToast(opt)
		}
	}
}
