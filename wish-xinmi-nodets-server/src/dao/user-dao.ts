import {User} from './model';
import {Op} from './sequelize';

async function insertOne(obj: any) {
    const user: any = await User.create(obj);
    return user;
}

async function update(obj: any, option: any) {
    await User.update(obj, option);
}

async function getUserDetail(userId: string) {
    return await User.findOne({
        where:{
            userId: userId
        }
    });
}

async function getMaxXinmiId() {
    return await User.max('username');
};

async function findAll() {
    return await User.findAll()
}

async function findByPk(userId: string) {
    return await User.findByPk(userId)
}

async function findOne(obj: any) {
    return await User.findOne(obj);
}

async function max(name: string) {
    return await User.max(name);
}

export default {
    insertOne,
    getUserDetail,
    getMaxXinmiId,
    update,
    findAll,
    findByPk,
    findOne,
    max
}