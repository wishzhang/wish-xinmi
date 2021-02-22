

/**
 * 全站http配置
 *
 * axios参数说明
 * isSerialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios';
import {Message} from 'element-ui'

axios.defaults.baseURL = '/api'

axios.defaults.timeout = 10000;

axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500;
};

axios.defaults.withCredentials = true;

axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
});

axios.interceptors.response.use(res => {
  if (res.status === 200) {
    return res.data;
  } else {
    // TODO 开发环境这样子，生产环境有更好的做法
    Message({
      message: '服务器出错了',
      type: 'error'
    })
    return Promise.reject(res.data);
  }
}, error => {
  Message({
    message: '服务器出错了',
    type: 'error'
  })
  return Promise.reject(new Error(error));
});

export default axios;

