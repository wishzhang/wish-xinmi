import request from '../router/axios';

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
