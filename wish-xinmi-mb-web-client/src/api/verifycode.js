import request from '../router/axios';

export const sendEmailRequest = (params) => {
    return request({
        url: '/verifyCode/sendEmailCode',
        method: 'post',
        data: params
    })
}