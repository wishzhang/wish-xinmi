const contactDao = require('../dao/contact-dao');
const userService = require('./user-service');
const util = require('../util');

const getYesContactList = async ({userId}) => {
    const contactList = await contactDao.getYesContactList({userId});
    const ch = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const list = ch.map(label => {
        const obj = {};
        const records = contactList.filter(user => {
            const letter = util.getFirstUpperLetter(user.name);
            return letter === label;
        });

        obj.label = label;
        obj.records = records;
        return obj;
    });

    const otherRecords = contactList.filter(user => {
        const letter = util.getFirstUpperLetter(user.name);
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
    const targetDetail = await userService.getOneUser({userId: contactId});
    const originDetail = await userService.getOneUser({userId: userId});
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
    let list = await contactDao.getConfirmContactList({userId});
    return list;
}

const confirmContact = async ({userId, contactId}) => {
    const targetDetail = await userService.getOneUser({userId: contactId});
    const originDetail = await userService.getOneUser({userId: userId});
    await contactDao.confirmContact({
        userId,
        contactId,
        originName: originDetail.username,
        targetName: targetDetail.username
    });
}

const getUserContactStatus = async ({userId, contactId}) => {
    const list = await contactDao.getUserContactStatus({userId, contactId});
    return list;
}

const getContactInfoHad = async ({userId, contactId}) => {
    return await contactDao.getContactInfoHad({userId, contactId});
}

const getContactWarnNum = async ({userId}) => {
    const list = await contactDao.getContactNoCheckedNum({userId});
    if (list.length > 0) {
        return list[0].num;
    }
    return 0;
}

const setAllContactChecked = async ({userId}) => {
    return await contactDao.setAllContactChecked({userId});
}

const editContact = async ({userId, contactId, contactName}) => {
    return await contactDao.editContact({userId, contactId, contactName});
}

const deleteContact = async ({userId, contactId}) => {
    return await contactDao.deleteContact({userId, contactId});
}

module.exports = {
    getNoContactList,
    getYesContactList,
    addContact,
    getConfirmContactList,
    confirmContact,
    getUserContactStatus,
    getContactInfoHad,
    getContactWarnNum,
    setAllContactChecked,
    editContact,
    deleteContact
}