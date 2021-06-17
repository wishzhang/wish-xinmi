// 密码为6-20位数字字母组合且不能有空格
export function validPassword(password) {
	const reg = /^[A-Za-z]+[0-9]+[A-Za-z0-9]*$|^[0-9]+[A-Za-z]+[A-Za-z0-9]*$/;
	if (password.length >= 6 && password.length <= 20 && reg.test(password))
		if (reg.test(password)) {
			return true;
		}
	return false;
}

// 邮箱
export function validEmail(s) {
	return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s);
}

export function validatenull(val) {
	if (typeof val == "boolean") {
		return false;
	}
	if (typeof val == "number") {
		return false;
	}
	if (val instanceof Array) {
		if (val.length == 0) return true;
	} else if (val instanceof Object) {
		if (JSON.stringify(val) === "{}") return true;
	} else {
		if (val == "null" || val == null || val == "undefined" || val == undefined || val == "") return true;
		return false;
	}
	return false;
}

export const serialize = data => {
	let list = [];
	Object.keys(data).forEach(ele => {
		list.push(`${ele}=${encodeURIComponent(data[ele])}`)
	})
	return list.join('&');
}

export function rpx2px(size) {
	const info = uni.getSystemInfoSync()
	const scale = 750 / info.windowWidth;
	// 分离字体大小和单位,rpx 转 px
	let s = Number.isNaN(parseFloat(size)) ? 0 : parseFloat(size)
	let u = size.toString().replace(/[0-9]/g, '').replace('-', '')
	if (u == 'rpx') {
		s /= scale
		u = 'px'
	} else if (u == '') {
		u = 'px'
	} else if (u == 'vw') {
		u = 'px'
		s = s / 100 * 750 / scale
	}
	return [s, u, s + u]
}

export function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return 'xinmi_' + uuid;
}
