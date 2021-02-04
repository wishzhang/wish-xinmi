import request from '../router/axios';

export const loginRequest = (params)=>{
  return request({
    url: '/login',
    method: 'get',
    params: params
  })
}