import request from './request.js'

export const sendEmailRequest = (params) => {
    return request({
        url: '/verifyCode/sendEmailCode',
        method: 'post',
        data: params
    })
}