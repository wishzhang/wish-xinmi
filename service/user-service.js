const userDao = require('../dao/user-dao');
const util = require('../util/index');

const getUserList = async () => {
    return await userDao.getUserList();
}

const insertUser = async (obj) => {
    return await userDao.insertUser(obj);
}

const updateUser = async (obj) => {
    obj.avatarUrl = util.removeDomain(obj.avatarUrl);
    return await userDao.updateUser(obj);
}

const getUserDetail = async ({userId}) => {
    const list = await userDao.getUserDetail({userId});
    if (list.length > 0) {
        const user = list[0];
        // user.avatarUrl = `${util.getMinio().host}` + user.avatarUrl;
        return list[0];
    } else {
        return null;
    }
}

module.exports = {
    getUserList,
    insertUser,
    getUserDetail,
    updateUser
}