import request from './request.js'

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

export const refreshTokenRequest = () => {
    return request({
        url: '/login/refreshToken',
        method: 'post'
    })
}

