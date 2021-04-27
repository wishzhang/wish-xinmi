const loginDao = require('../dao/login-dao');
const userDao = require('../dao/user-dao');

const login = async (obj) => {
    return await loginDao.login(obj);
}

const hasAccount = async (username) => {
    const arr = await userDao.getUserDetail({username});
    return arr.length > 0 ? true : false;
}

module.exports = {
    login,
    hasAccount
}