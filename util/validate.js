export function validatenull(val) {
    if (typeof val == 'boolean') {
        return false;
    }
    if (typeof val == 'number') {
        return false;
    }
    if (val instanceof Array) {
        if (val.length == 0) return true;
    } else if (val instanceof Object) {
        if (JSON.stringify(val) === '{}') return true;
    } else {
        if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true;
        return false;
    }
    return false;
}

// 密码为6-20位数字字母组合 不能有空格
export function validPassword(password = '') {
    if (password.length >= 6 && password.length <= 20 || (/^[a-zA-Z0-9]*$/.test(password))) {
        return true;
    }
    return false;
}