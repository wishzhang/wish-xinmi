const success: (x?: any) => Object =
    (data = {}) => {
        return {
            code: 0,
            msg: 'success',
            data: data
        }
    }

const fail: (code?: any, msg?: any, data?: any) => Object =
    (code: any, msg: any, data: any) => {
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

export default {
    success: success,
    fail: fail
}