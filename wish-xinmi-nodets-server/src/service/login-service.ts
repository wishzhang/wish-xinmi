import loginDao = require('../dao/login-dao');

const login = async (username: string, password: string) => {
    return await loginDao.login(username, password);
}

export = {
    login
}