const mysql = require('./mysql');
const util = require('../util');
const userDao = require('./user-dao');
const contactDao = require('./contact-dao');
const uuid = util.uuid;
const Daogenerator = require('./dao-generator');

const baseDao = Daogenerator({
    tableName: 'xinmi_thought',
    columns: [
        {name: 'thought_id', type: Daogenerator.columnGType.uuid},
        {name: 'content', type: Daogenerator.columnGType.string},
        {name: 'create_time', type: Daogenerator.columnGType.datetime},
        {name: 'create_user', type: Daogenerator.columnGType.string},
        {name: 'photos_url', type: Daogenerator.columnGType.string},
    ]
})

// 添加一条朋友圈
const addThought = async ({createUser, content, photosUrl}) => {
    await baseDao.insert({
        'create_user': createUser,
        'content': content,
        'photos_url': photosUrl
    })
}

const getOneCircleDetail = async (thoughtId) => {
    let thought = await baseDao.getOne({
        searchs: [
            {name: 'thought_id', value: thoughtId, signs: ['equal']}
        ]
    });
    let user = await userDao.getOne({
        searchs: [
            {name: 'id', value: thought.createUser, signs: ['equal']}
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
    }
}

/**
 * 获取我的朋友圈里的所有人发的，即我的所有好友包括我自己发的朋友圈
 * @param userId
 * @param current
 * @param size
 * @returns {Promise<{current: number, total: *, size: number, records}>}
 */
const getCirclePage = async ({userId, current, size}) => {
    let data = {};
    let list = [];
    let createUserIdList = [];
    let thoughtList = [];
    let contactList = [];

    contactList = await contactDao.getList({
        searchs: [
            {name: 'user_id', value: userId, signs: ['equal']}
        ]
    })

    createUserIdList = contactList.map(el => el.contactId);
    createUserIdList = [userId, ...createUserIdList];

    for (let id of createUserIdList) {
        const arr = await baseDao.getList({
            searchs: [{
                name: 'create_user', value: id, signs: ['equal']
            }]
        });
        thoughtList.push(...arr);
    }

    for (let thought of thoughtList) {
        let obj = Object.assign({}, thought);
        let info = {};
        let createUserId = thought.createUser;

        info = await userDao.getUserDetail({userId: createUserId});
        obj.name = info.username;
        obj.avatarUrl = info.avatarUrl;

        if (userId !== createUserId) {
            const contact = await contactDao.getContactInfoHad({userId: userId, contactId: createUserId})
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
    }

    return data;
}

const getUserThoughtPage = async ({userId, current, size}) => {
    const data = await baseDao.getPage({
        searchs: [
            {name: 'create_user', value: userId, signs: ['equal']},
            {name: 'create_time', signs: ['desc']},
        ],
        current,
        size
    });

    const records = [];
    for (let item of data.records) {
        const thoughtId = item.thoughtId;
        const thought = await getOneCircleDetail(thoughtId);
        if (thought) {
            records.push(thought);
        }
    }

    data.records = records;

    return data;
}

module.exports = {
    addThought,
    ...baseDao,
    getCirclePage,
    getUserThoughtPage
}

