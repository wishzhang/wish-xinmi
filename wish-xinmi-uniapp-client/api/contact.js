import request from './request.js'

export const fetchYetContactListRequest = (params) => {
    return request({
        url: '/contact/getYesContactList',
        method: 'get',
        params: params
    })
}

export const fetchNoContactListRequest = (params) => {
    return request({
        url: '/contact/getNoContactList',
        method: 'get',
        params: params
    })
}

export const fetchConfirmContactListRequest = (params) => {
    return request({
        url: '/contact/getConfirmContactList',
        method: 'get',
        params: params
    })
}

export const addContactRequest = (params) => {
    return request({
        url: '/contact/addContact',
        method: 'get',
        params: params
    })
}

export const confirmContactRequest = (params) => {
    return request({
        url: '/contact/confirmContact',
        method: 'get',
        params: params
    })
}

export const fetchUserContactStatusRequest = (params) => {
    return request({
        url: '/contact/getUserContactStatus',
        method: 'get',
        params: params
    })
}

export const fetchContactInfoHadRequest = (params) => {
    return request({
        url: '/contact/getContactInfoHad',
        method: 'get',
        params: params
    })
}

export const fetchContactDetailRequest = (params) => {
    return request({
        url: '/contact/getContactDetail',
        method: 'get',
        params: params
    })
}

export const fetchContactWarnNumRequest = (params) => {
    return request({
        url: '/contact/getContactWarnNum',
        method: 'get',
        params: params
    })
}

export const setAllContactCheckedRequest = (params) => {
    return request({
        url: '/contact/setAllContactChecked',
        method: 'post',
        data: params
    })
}

export const editContactRequest = (params) => {
    return request({
        url: '/contact/editContact',
        method: 'post',
        data: params
    })
}

export const deleteContactRequest = (params) => {
    return request({
        url: '/contact/deleteContact',
        method: 'post',
        data: params
    })
}



