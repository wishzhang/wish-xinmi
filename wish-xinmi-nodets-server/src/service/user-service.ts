import util from "../util";
import {User} from "../dao/model";

async function getUserList() {
    return await User.findAll();
};

async function insertUser(obj: any) {
    return await User.create(obj);
};

async function updateUser(obj: any) {
    obj.avatarUrl = util.removeDomain(obj.avatarUrl);
    return await User.update(obj, {where: {userId: obj.userId}})
};

async function findByPk(userId: string) {
    return await User.findByPk(userId);
};

async function findEmailAddress(emailAddress: string) {
    return await User.findOne({
        where: {
            emailAddress: emailAddress
        }
    })
};

async function getMaxXinmiId() {
    return await User.max('username');
};

async function updatePasswordByEmailAddress(password: string, emailAddress: string) {
    return await User.update({password, emailAddress}, {
        where: {
            emailAddress
        },
        fields: ['password']
    })
};

async function editEmailAddress(originEmailAddress: string, targetEmailAddress: string, password: string) {
    return await User.update({emailAddress: targetEmailAddress}, {
        where: {
            emailAddress: originEmailAddress,
            password: password
        }
    })
};

async function findOne(obj: any) {
    return await User.findOne({
        where: obj
    });
};

async function hasUser(userId: string) {
    const user = await findOne({userId: userId});
    return user !== null;
}

export default {
    getUserList,
    insertUser,
    updateUser,
    findByPk,
    getMaxXinmiId,
    updatePasswordByEmailAddress,
    editEmailAddress,
    findEmailAddress,
    findOne,
    hasUser
}