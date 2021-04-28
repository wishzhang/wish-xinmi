import request from '../router/axios';

export const findPasswordByEmailRequest = (params) => {
    return request({
        url: '/login/findPasswordByEmail',
        method: 'post',
        data: params
    })
}

export const loginByEmailRequest = (params) => {
    return request({
        url: '/login/loginByEmail',
        method: 'post',
        data: params
    })
}

export const loginByPasswordRequest = (params) => {
    return request({
        url: '/login/loginByPassword',
        method: 'post',
        data: params
    })
}

