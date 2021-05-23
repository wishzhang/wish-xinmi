import util from "../util";
import userDao from '../dao/user-dao';

async function getUserList() {
    return await userDao.findAll()
};

async function insertUser(obj: any) {
    return await userDao.insertOne(obj);
};

async function updateUser(obj: any) {
    obj.avatarUrl = util.removeDomain(obj.avatarUrl);
    return await userDao.update(obj, {where: {userId: obj.userId}})
};

async function getOneUser(userId: string) {
    return await userDao.findByPk(userId);
};

async function findEmailAddress(emailAddress: string) {
    return await userDao.findOne({
        where: {
            emailAddress: emailAddress
        }
    })
};

async function getMaxXinmiId() {
    return await userDao.max('username');
};

async function updatePasswordByEmailAddress(password: string, emailAddress: string) {
    return await userDao.update({password, emailAddress}, {
        where: {
            emailAddress
        },
        fields: ['password']
    })
};

async function editEmailAddress(originEmailAddress: string, targetEmailAddress: string, password: string) {
    return await userDao.update({emailAddress: targetEmailAddress}, {
        where: {
            emailAddress: originEmailAddress,
            password: password
        }
    })
};

async function findOne(obj: any) {
    return await userDao.findOne({
        where: obj
    });
};

async function hasUser(userId: string) {
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