// 密码为6-20位数字字母组合且不能有空格
function validPassword(password) {
    const reg = /^[A-Za-z]+[0-9]+[A-Za-z0-9]*$|^[0-9]+[A-Za-z]+[A-Za-z0-9]*$/;
    if (password.length >= 6 && password.length <= 20 && reg.test(password))
        if (reg.test(password)) {
            return true;
        }
    return false;
}


// 邮箱
function validEmail(s) {
    return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s);
}

module.exports = {
	validPassword,
	validEmail
}