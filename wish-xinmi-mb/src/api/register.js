import request from '../router/axios';

export const registerRequest = (params)=>{
  return request({
    url: '/user/add',
    method: 'post',
    params: params
  })
}
