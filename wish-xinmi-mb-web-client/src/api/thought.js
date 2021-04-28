import request from '../router/axios';

export const addThoughtRequest = (formData) => {
    return request({
        url: '/circle/addThought',
        method: 'post',
        data: formData
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
