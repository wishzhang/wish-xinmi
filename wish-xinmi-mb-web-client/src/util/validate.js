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

export function validAccount(account = "") {
    if (account.length < 4 || account.length > 20 || !(/^[a-zA-Z0-9_]*$/.test(account))) {
        return false;
    }
    return true;
}

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
