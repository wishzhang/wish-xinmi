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
        return list[0];
    } else {
        return null;
    }
}

const getOneUser = async ({emailAddress, username, password}) => {
    const list = await userDao.getUserDetail({emailAddress, username, password});
    if (list.length > 0) {
        const user = list[0];
        return list[0];
    } else {
        return null;
    }
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
    getUserDetail,
    updateUser,
    getOneUser,
    getMaxXinmiId,
    updatePasswordByEmailAddress,
    editEmailAddress
}