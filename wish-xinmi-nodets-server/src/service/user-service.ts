import util from "../util";
import userDao from '../dao/user-dao';

const getUserList = async () => {
    return await userDao.findAll()
};

const insertUser = async (obj: any) => {
    return await userDao.insertOne(obj);
};

const updateUser = async (obj: any) => {
    obj.avatarUrl = util.removeDomain(obj.avatarUrl);
    return await userDao.update(obj, {where: {userId: obj.userId}})
};

const getOneUser = async (userId?: string) => {
    return await userDao.findByPk(userId);
};

const findEmailAddress = async (emailAddress: string) => {
    return await userDao.findOne({
        where: {
            emailAddress
        }
    })
};

const getMaxXinmiId = async () => {
    return await userDao.max('username');
};

const updatePasswordByEmailAddress = async (password: string, emailAddress: string) => {
    return await userDao.update({password, emailAddress}, {
        where: {
            emailAddress
        },
        fields: ['password']
    })
};

const editEmailAddress = async (originEmailAddress: string, targetEmailAddress: string, password: string) => {
    return await userDao.update({emailAddress: targetEmailAddress}, {
        where: {
            emailAddress: originEmailAddress,
            password: password
        }
    })
};

const findOne = async (obj: any) => {
    return await userDao.findOne(obj);
};

const hasUser = async (userId: string) => {
    const user = await userDao.findByPk(userId);
    return user !== null;
}

export default {
    getUserList,
    insertUser,
    updateUser,
    getOneUser,
    getMaxXinmiId,
    updatePasswordByEmailAddress,
    editEmailAddress,
    findEmailAddress,
    findOne,
    hasUser
}