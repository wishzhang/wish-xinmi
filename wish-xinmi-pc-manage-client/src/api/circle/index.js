import request from '@/router/axios';

export const fetchCirclePageRequest = (params) => {
  return request({
    url: '/circle/getPage',
    method: 'get',
    params: params
  })
}
