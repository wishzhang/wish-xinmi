import request from '../router/axios';

export const sendEmailRequest = (params) => {
    return request({
        url: '/verifyCode/sendEmail',
        method: 'post',
        data: params
    })
}