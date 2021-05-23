import contactDao from "../dao/contact-dao";
import userService from "./user-service";
import util from "../util";

async function getYesContactList(userId: string) {
    const contactList: any = await contactDao.getYesContactList(userId);
    const ch = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
        "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const list = ch.map(label => {
        const obj: any = {};
        const records = contactList.filter((user: any) => {
            const letter = util.getFirstUpperLetter(user.name);
            return letter === label;
        });

        obj.label = label;
        obj.records = records;
        return obj;
    });

    const otherRecords = contactList.filter((user: any) => {
        const letter = util.getFirstUpperLetter(user.name);
        return !ch.includes(letter);
    });
    const otherObj = {
        label: "#",
        records: otherRecords
    };

    const allList = [...list, otherObj];
    return allList;
}

async function getNoContactList(userId: string, username = "") {
    const list = await contactDao.getNoContactList(userId, username);
    return list;
}

async function addContact(userId: string, contactId: string, validateMsg: string) {
    const targetDetail: any = await userService.getOneUser(contactId);
    const originDetail: any = await userService.getOneUser(userId);
    const msg = validateMsg ? validateMsg : `你好，我是${originDetail.username}`;
    return await contactDao.addContact(
        userId,
        contactId,
        originDetail.username,
        targetDetail.username,
        msg,
    );
}

async function getConfirmContactList(userId: string) {
    const list = await contactDao.getConfirmContactList(userId);
    return list;
}

async function confirmContact(userId: string, contactId: string) {
    const targetDetail: any = await userService.getOneUser(contactId);
    const originDetail: any = await userService.getOneUser(userId);
    await contactDao.confirmContact(userId,
        contactId,
        originDetail.username,
        targetDetail.username);
}

async function getUserContactStatus(userId: string, contactId: string) {
    return await contactDao.getUserContactStatus(userId, contactId);
}

async function getContactInfoHad(userId: string, contactId: string) {
    return await contactDao.getContactInfoHad(userId, contactId);
};

async function getContactWarnNum(userId: string) {
    const list: any = await contactDao.getContactNoCheckedNum(userId);
    if (list.length > 0) {
        return list[0].num;
    }
    return 0;
};

async function setAllContactChecked(userId: string) {
    return await contactDao.setAllContactChecked(userId);
};

async function editContact(userId: string, contactId: string, contactName: string) {
    return await contactDao.editContact(userId, contactId, contactName);
};

async function deleteContact(userId: string, contactId: string) {
    return await contactDao.deleteContact(userId, contactId);
};

async function isContact(userId: string, contactId: string) {
    return await contactDao.isContact(userId, contactId);
}

export default {
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
    deleteContact,
    isContact
}