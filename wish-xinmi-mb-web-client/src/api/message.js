import request from '../router/axios';

export const fetchContactMessagePageRequest = (params) => {
    return request({
        url: '/message/getContactMessagePage',
        method: 'get',
        params: params
    })
}

export const fetchMessagePageByChatIdRequest = (params) => {
    return request({
        url: '/message/getMessagePageByChatId',
        method: 'get',
        params: params
    })
}

export const fetchMineAllChatListRequest = (params) => {
    return request({
        url: '/message/getMineAllChatList',
        method: 'get',
        params: params
    })
}

export const addMessageToContactRequest = (params) => {
    return request({
        url: '/message/addMessage',
        method: 'post',
        data: params
    })
}

export const checkMessageRequest = (params) => {
    return request({
        url: '/message/checkMessage',
        method: 'post',
        data: params
    })
}


