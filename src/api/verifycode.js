import request from '../router/axios';

export const sendEmailRequest = (params) => {
    return request({
        url: '/verifyCode/sendEmail',
        method: 'get',
        params: params
    })
}