import loginDao from "../dao/login-dao";

async function login(username: string, password: string) {
    return await loginDao.login(username, password);
};

export default {
    login
}