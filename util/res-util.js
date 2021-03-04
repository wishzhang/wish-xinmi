
/**
 * {
 *   code: 0,
 *   msg: 'success',
 *   data: ...
 * }
 *
 * {
 *     code: 1,2,3,,,
 *     msg: '自定义业务错误信息'，
 *     data: null
 * }
 *
 * {
 *     code: -1,-2, -3
 *     msg: '系统级错误信息',
 *     data: null
 * }
 */
const success = (data = {}) => {
    return {
        code: 0,
        msg: 'success',
        data: data
    }
}

const fail = (code, msg, data) => {
    if (typeof code !== 'number'
        && !Number.isNaN(code)
        && code <= 0) {
        throw TypeError();
    }

    return {
        code: code,
        msg: msg,
        data: data
    }
}

module.exports = {
    success,
    fail
}



