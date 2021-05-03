const userDao = require('../dao/user-dao');
const util = require('../util/index');

const getUserList = async () => {
    return await userDao.getList();
}

const insertUser = async (obj) => {
    return await userDao.insert(obj);
}

const updateUser = async (obj) => {
    obj.avatarUrl = util.removeDomain(obj.avatarUrl);
    return await userDao.updateUser(obj);
}

const getOneUser = async ({userId, emailAddress, username, password}) => {
    return await userDao.getUserDetail({userId, emailAddress, username, password});
}

const getMaxXinmiId = async () => {
    const list = await userDao.getMaxXinmiId();
    if (list.length > 0) {
        return list[0].xmId;
    } else {
        return null;
    }
}

const updatePasswordByEmailAddress = async (password, emailAddress) => {
    return userDao.updatePasswordByEmailAddress(password, emailAddress);
}

const editEmailAddress = async ({originEmailAddress, targetEmailAddress, password}) => {
    return userDao.editEmailAddress({originEmailAddress, targetEmailAddress, password});
}

module.exports = {
    getUserList,
    insertUser,
    updateUser,
    getOneUser,
    getMaxXinmiId,
    updatePasswordByEmailAddress,
    editEmailAddress
}