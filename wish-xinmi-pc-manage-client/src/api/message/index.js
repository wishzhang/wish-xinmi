import request from '@/router/axios';

export const fetchAllMessagePageRequest = (params) => {
  return request({
    url: '/message/getAllMessagePage',
    method: 'get',
    params: params
  })
}
