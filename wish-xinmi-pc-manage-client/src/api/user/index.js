import request from '@/router/axios';
import website from "@/config/website";

export const loginByUsername = (tenantId, account, password, type, key, code) => request({
  url: '/api/blade-auth/token',
  method: 'post',
  params: {
  }
});

export const fetchUserListRequest = (params) => {
  return request({
    url: '/user/page',
    method: 'get',
    params: params
  })
}
