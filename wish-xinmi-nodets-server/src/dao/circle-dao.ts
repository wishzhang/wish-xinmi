import mysql from "./mysql";

import util = require("../util");
import userDao = require("./user-dao");
import contactDao = require("./contact-dao");
import Daogenerator = require("./dao-generator");

const baseDao = Daogenerator({
    tableName: "xinmi_thought",
    columns: [
        {name: "thought_id", type: Daogenerator.columnGType.uuid},
        {name: "content", type: Daogenerator.columnGType.string},
        {name: "create_time", type: Daogenerator.columnGType.datetime},
        {name: "create_user", type: Daogenerator.columnGType.string},
        {name: "photos_url", type: Daogenerator.columnGType.string},
    ]
});

const uuid = util.uuid;

// 添加一条朋友圈
const addThought = async (createUser: string, content: string, photosUrl?: string) => {
    await baseDao.insert({
        "create_user": createUser,
        "content": content,
        "photos_url": photosUrl
    });
};

const getOneCircleDetail = async (thoughtId: string) => {
    const thought = await baseDao.getOne({
        wheres: [
            {name: "thought_id", value: thoughtId, signs: ["equal"]}
        ]
    });
    const user = await userDao.getOne({
        wheres: [
            {name: "id", value: thought.createUser, signs: ["equal"]}
        ]
    });
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

    contactList = await contactDao.getList({
        wheres: [
            {name: "user_id", value: userId, signs: ["equal"]}
        ]
    });

    createUserIdList = contactList.map((el: any) => el.contactId);
    createUserIdList = [userId, ...createUserIdList];

    for (const id of createUserIdList) {
        const arr: any = await baseDao.getList({
            wheres: [{
                name: "create_user", value: id, signs: ["equal"]
            }]
        });
        thoughtList.push(...arr);
    }

    for (const thought of thoughtList) {
        const obj = Object.assign({}, thought);
        let info: any = {};
        const createUserId = thought.createUser;

        info = await userDao.getUserDetail(createUserId);
        obj.name = info.username;
        obj.avatarUrl = info.avatarUrl;

        if (obj.userId !== createUserId) {
            const contact = await contactDao.getContactInfoHad(obj.userId, createUserId);
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
    const data: any = await baseDao.getPage({
        wheres: [
            {name: "create_user", value: userId, signs: ["equal"]},
            {name: "create_time", signs: ["desc"]},
        ],
        current: current,
        size: size
    });

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

export = {
    addThought,
    ...baseDao,
    getCirclePage,
    getUserThoughtPage
}

