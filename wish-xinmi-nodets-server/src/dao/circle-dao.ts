import util from "../util";
import {query, queryPage} from "./sequelize";
import {User, Contact, Thought} from "./model";
import userDao from "./user-dao";
import contactDao from "./contact-dao";

const uuid = util.uuid;

// 添加一条朋友圈
const addThought = async (createUser: string, content: string, photosUrl?: string) => {
    const thought = await Thought.create({
        createUser: createUser,
        content: content,
        photosUrl: photosUrl
    });
    await thought.save();
};

const getOneCircleDetail = async (thoughtId: string) => {
    const thought: any = await Thought.findByPk(thoughtId);
    const user: any = await User.findByPk(thought.createUser);

    return {
        username: user.username,
        avatarUrl: user.avatarUrl,
        thoughtId: thought.thoughtId,
        content: thought.content,
        createUser: thought.create_user,
        photosUrl: thought.photosUrl,
        createTime: thought.createTime
    };
};

/**
 * 获取我的朋友圈里的所有人发的，即我的所有好友包括我自己发的朋友圈
 * @param userId
 * @param current
 * @param size
 * @returns {Promise<{current: number, total: *, size: number, records}>}
 */
const getCirclePage = async (userId: number, current?: number, size?: number) => {
    let data = {};
    const list = [];
    let createUserIdList = [];
    const thoughtList = [];
    let contactList: any = [];

    contactList = await Contact.findAll({
        where: {
            userId: userId
        }
    })

    createUserIdList = contactList.map((el: any) => el.contactId);
    createUserIdList = [userId, ...createUserIdList];

    for (const id of createUserIdList) {
        const arr: any = await Thought.findAll({
            where: {
                createUser: id
            }
        })
        thoughtList.push(...arr);
    }

    for (const thought of thoughtList) {
        const obj = Object.assign({}, thought);
        let info: any = {};
        const createUserId = thought.createUser;

        info = await userDao.getUserDetail(createUserId);
        obj.name = info.username;
        obj.avatarUrl = info.avatarUrl;

        if (info.userId !== createUserId) {
            const contact = await contactDao.getContactInfoHad(info.userId, createUserId);
            obj.name = contact.name;
        }

        list.push(obj);
    }

    list.sort((a, b) => {
        return new Date(b.createTime).valueOf() - new Date(a.createTime).valueOf();
    });

    const curIndex = (current - 1) * size;
    const records = list.slice(curIndex, curIndex + size);

    data = {
        records: records,
        current: current,
        size: size,
        total: list.length
    };

    return data;
};

const getUserThoughtPage = async (userId: string, current?: number, size?: number) => {
    const data: any = await queryPage(`
        select * from xinmi_thought where create_user='${userId}' order by created_at desc
    `, current, size);

    const records = [];
    for (const item of data.records) {
        const thoughtId = item.thoughtId;
        const thought = await getOneCircleDetail(thoughtId);
        if (thought) {
            records.push(thought);
        }
    }

    data.records = records;

    return data;
};

export default {
    addThought,
    getCirclePage,
    getUserThoughtPage
}

