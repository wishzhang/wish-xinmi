import request from '../router/axios';

export const addThoughtRequest = (params) => {
    return request({
        url: '/circle/addThought',
        method: 'get',
        params: params
    })
}

export const fetchPeopleListRequest = (params) => {
    return request({
        url: '/circle/getPeopleList',
        method: 'get',
        params: params
    })
}

export const fetchMineAllListRequest = (params) => {
    return request({
        url: '/circle/getMineAllList',
        method: 'get',
        params: params
    })
}
