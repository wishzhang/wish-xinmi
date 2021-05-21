import contactDao from "../dao/contact-dao";
import userService from "./user-service";
import util from "../util";

const getYesContactList = async (userId: string) => {
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
};

const getNoContactList = async (userId: string, username = "") => {
    const list = await contactDao.getNoContactList(userId, username);
    return list;
};

const addContact = async (userId: string, contactId: string, validateMsg: any) => {
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
};

const getConfirmContactList = async (userId: any) => {
    const list = await contactDao.getConfirmContactList(userId);
    return list;
};

const confirmContact = async (userId: any, contactId: any) => {
    const targetDetail: any = await userService.getOneUser(contactId);
    const originDetail: any = await userService.getOneUser(userId);
    await contactDao.confirmContact(userId,
        contactId,
        originDetail.username,
        targetDetail.username);
};

const getUserContactStatus = async (userId: any, contactId: any) => {
    return await contactDao.getUserContactStatus(userId, contactId);
};

const getContactInfoHad = async (userId: any, contactId: any) => {
    return await contactDao.getContactInfoHad(userId, contactId);
};

const getContactWarnNum = async (userId: any) => {
    const list: any = await contactDao.getContactNoCheckedNum(userId);
    if (list.length > 0) {
        return list[0].num;
    }
    return 0;
};

const setAllContactChecked = async (userId: any) => {
    return await contactDao.setAllContactChecked(userId);
};

const editContact = async (userId: any, contactId: any, contactName: any) => {
    return await contactDao.editContact(userId, contactId, contactName);
};

const deleteContact = async (userId: any, contactId: any) => {
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