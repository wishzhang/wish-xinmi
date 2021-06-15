import request from './request.js'

export const fetchUserInfoRequest = (params) => {
    return request({
        url: '/user/detail',
        method: 'get',
        params: params
    })
}

export const updateUserInfoRequest = (params) => {
    return request({
        url: '/user/update',
        method: 'get',
        params: params
    })
}

export const editEmailAddressRequest = (params) => {
    return request({
        url: '/user/editEmailAddress',
        method: 'post',
        data: params
    })
}
