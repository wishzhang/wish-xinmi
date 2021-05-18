import loginDao from "../dao/login-dao";

const login = async (username: string, password: string) => {
    return await loginDao.login(username, password);
};

export default {
    login
}