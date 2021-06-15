import request from './request.js'

export const addThoughtRequest = (formData) => {
    return request({
        url: '/circle/addThought',
        method: 'post',
        data: formData
    })
}

export const fetchPageRequest = (params)=>{
    return request({
        url: '/circle/getPage',
        method: 'get',
        params: params
    })
}

export const fetchUserThoughtPageRequest = (params)=>{
    return request({
        url: '/circle/getUserThoughtPage',
        method: 'get',
        params: params
    })
}
