import contactDao from "../dao/contact-dao";
import userService from "./user-service";
import util from "../util";
import {sequelize, Op} from "../dao/sequelize";
import messageDao from "../dao/message-dao";
import chatDao from "../dao/chat-dao";
import {Contact, ContactRecord} from "../dao/model";

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

    const row: any = await ContactRecord.findOne({where: {userId: userId, contactId: contactId}});
    if (row !== null || row && row.status !== 2) {
        throw Error(`当前用户${userId}不能添加${contactId}为联系人`);
    }

    if (row && row.status === 2) {
        await confirmContact(userId, contactId);
        return false
    } else if (row === null) {
        await sequelize.transaction(async (t: any) => {
            await ContactRecord.bulkCreate([
                {userId: userId, contactId: contactId, status: 1, validateMsg: msg},
                {userId: contactId, contactId: userId, status: 2, validateMsg: msg}
            ], {transaction: t})
        });
        return true;
    }
}

async function getConfirmContactList(userId: string) {
    const list = await contactDao.getConfirmContactList(userId);
    return list;
}

async function confirmContact(userId: string, contactId: string) {
    const targetDetail: any = await userService.getOneUser(contactId);
    const originDetail: any = await userService.getOneUser(userId);
    const originName = originDetail.username;
    const targetName = targetDetail.username;

    const row = await ContactRecord.findOne({where: {userId: userId, contactId: contactId}});
    if (!(row && row.status === 2)) {
        throw Error(`当前用户${userId}不能确认${contactId}为联系人`);
    }

    const result = await sequelize.transaction(async (t: any) => {
        await ContactRecord.update({status: 3}, {
            where: {
                [Op.or]: [
                    {userId: userId, contactId: contactId},
                    {userId: contactId, contactId: userId},
                ]
            },
            transaction: t
        })

        const is = await contactDao.isContact(userId, contactId, true);
        if (!is) {
            await Contact.bulkCreate([
                {userId: userId, contactId: contactId, contactName: targetName},
                {contactId: userId, userId: contactId, contactName: originName}
            ], {transaction: t})
        } else {
            await Contact.restore({
                where: {
                    [Op.or]: [
                        {userId: userId, contactId: contactId},
                        {userId: contactId, contactId: userId},
                    ]
                },
                transaction: t
            })
        }
    })
}

async function getUserContactStatus(userId: string, contactId: string) {
    const row: any = await ContactRecord.findOne({
        where: {
            userId: userId,
            contactId: contactId
        }
    });
    return row && row.status;
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
    return await Contact.update({
        contactName
    }, {
        where: {
            userId: userId,
            contactId: contactId
        }
    })
};

async function deleteContact(userId: string, contactId: string) {
    await sequelize.transaction(async (t: any) => {
        await messageDao.delMessageByPeople(userId, contactId, {force: true, transaction: t});
        await chatDao.delChat(userId, contactId, {force: true, transaction: t});
        await Contact.destroy({
            where: {
                [Op.or]: [
                    {userId: userId, contactId: contactId},
                    {userId: contactId, contactId: userId}
                ]
            },
            force: true,
            transaction: t
        });
        await ContactRecord.destroy({
            where: {
                [Op.or]: [
                    {userId: userId, contactId: contactId},
                    {userId: contactId, contactId: userId}
                ]
            },
            force: true,
            transaction: t
        });
    });
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