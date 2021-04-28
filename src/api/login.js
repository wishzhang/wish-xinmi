import request from '../router/axios';

export const loginRequest = (params) => {
    return request({
        url: '/login',
        method: 'get',
        params: params
    })
}

export const findPasswordByEmailRequest = (params) => {
    return request({
        url: '/login/findPasswordByEmail',
        method: 'get',
        params: params
    })
}

export const loginByEmailRequest = (params) => {
    return request({
        url: '/login/loginByEmail',
        method: 'get',
        params: params
    })
}

export const loginByPasswordRequest = (params) => {
    return request({
        url: '/login/loginByPassword',
        method: 'get',
        params: params
    })
}

