import request from '../router/axios';

export const  fetchContactMessageListRequest= (params)=>{
  return request({
    url: '/message/getContactMessageList',
    method: 'get',
    params: params
  })
}

export const  fetchMineAllChatListRequest= (params)=>{
  return request({
    url: '/message/getMineAllChatList',
    method: 'get',
    params: params
  })
}