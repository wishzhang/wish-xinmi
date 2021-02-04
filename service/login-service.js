const loginDao = require('../dao/login-dao');

const login = async (obj) => {
  return await loginDao.login(obj);
}

module.exports = {
  login
}