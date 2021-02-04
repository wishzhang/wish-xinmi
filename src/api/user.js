import request from '../router/axios';

export const fetchUserInfoRequest = (params)=>{
  return request({
    url: '/user/detail',
    method: 'get',
    params: params
  })
}