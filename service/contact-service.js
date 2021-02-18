const userDao = require('../dao/user-dao');
const contactDao = require('../dao/contact-dao');
const userService = require('./user-service');
const util = require('../util/index');

const getYesContactList = async ({userId}) => {
    const contactList = await contactDao.getYesContactList({userId});
    const ch = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const list = ch.map(label => {
        const obj = {};
        const records = contactList.filter(user => {
            const letter = util.getFirstUpperLetter(user.username);
            return letter === label;
        });

        obj.label = label;
        obj.records = records;
        return obj;
    });

    const otherRecords = contactList.filter(user => {
        const letter = util.getFirstUpperLetter(user.username);
        return !ch.includes(letter);
    });
    const otherObj = {
        label: '#',
        records: otherRecords
    };

    const allList = [...list, otherObj];
    return allList;
};

const getNoContactList = async ({userId, username}) => {
    const list = await contactDao.getNoContactList({userId, username});
    return list;
}

const addContact = async ({userId, contactId, validateMsg}) => {
    // 找到对应用户的名称
    const targetDetail = await userService.getUserDetail({userId: contactId});
    const originDetail = await userService.getUserDetail({userId: userId});
    let msg = validateMsg ? validateMsg : `你好，我是${originDetail.username}`;
    return await contactDao.addContact({
        userId,
        contactId,
        validateMsg: msg,
        originName: originDetail.username,
        targetName: targetDetail.username
    });
}

const getConfirmContactList = async ({userId}) => {
    const list = await contactDao.getConfirmContactList({userId});
    return list;
}

const confirmContact = async ({userId, contactId}) => {
    await contactDao.confirmContact({userId, contactId});
}

const getUserContactStatus = async ({userId, contactId}) => {
    const list = await contactDao.getUserContactStatus({userId, contactId});
    return list;
}

const getContactInfoHad = async ({userId, contactId}) => {
    return await contactDao.getContactInfoHad({userId, contactId});
}

module.exports = {
    getNoContactList,
    getYesContactList,
    addContact,
    getConfirmContactList,
    confirmContact,
    getUserContactStatus,
    getContactInfoHad: getContactInfoHad
}