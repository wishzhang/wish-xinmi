import userDao = require("../dao/user-dao");
import util = require("../util");

const getUserList = async () => {
    return await userDao.getList();
};

const insertUser = async (obj: any) => {
    let user = null;
    const id = await userDao.insertOne({
        'username': obj.username,
        'password': obj.password,
        'avatar_url': obj.avatarUrl,
        'bg_url': obj.bgUrl,
        'email_address': obj.emailAddress
    });

    if (id) {
        user = await getOneUser(id);
    }

    return user;
};

const updateUser = async (obj: any) => {
    obj.avatarUrl = util.removeDomain(obj.avatarUrl);
    return await userDao.updateUser(obj);
};

const getOneUser = async (userId?: string) => {
    return await userDao.getUserDetail(userId);
};

const findEmailAddress = async (emailAddress: string) => {
    return await userDao.getUserDetail(undefined, emailAddress);
};

const getMaxXinmiId = async () => {
    const list: any = await userDao.getMaxXinmiId();
    if (list.length > 0) {
        return list[0].xmId;
    } else {
        return null;
    }
};

const updatePasswordByEmailAddress = async (password: string, emailAddress: string) => {
    return userDao.updatePasswordByEmailAddress(password, emailAddress);
};

const editEmailAddress = async (originEmailAddress: string, targetEmailAddress: string, password: string) => {
    return userDao.editEmailAddress(originEmailAddress, targetEmailAddress, password);
};

const findOne = async (obj: any) => {
    return await userDao.findOne(obj);
};

export = {
    getUserList,
    insertUser,
    updateUser,
    getOneUser,
    getMaxXinmiId,
    updatePasswordByEmailAddress,
    editEmailAddress,
    findEmailAddress,
    findOne
}