import {Contact, User, Message, Chat} from "./model";
import {ContactRecord} from "./model";
import {sequelize, Op, query, QueryTypes} from './sequelize';
import chatDao from "./chat-dao";
import messageDao from "./message-dao";

async function addContact(
    userId: string,
    contactId: string,
    originName: string,
    targetName: string,
    validateMsg?: string
) {
    const row: any = await ContactRecord.findOne({where: {userId: userId, contactId: contactId}});
    if (row && row.status === 2) {
        await confirmContact(userId, contactId, originName, targetName);
    } else {
        const result = await sequelize.transaction(async (t: any) => {
            await ContactRecord.bulkCreate([
                {userId: userId, contactId: contactId, status: 1, validateMsg: validateMsg},
                {userId: contactId, contactId: userId, status: 2, validateMsg: validateMsg}
            ], {transaction: t})
        });
    }
}

async function confirmContact(userId: string, contactId: string, originName: string, targetName: string) {
    try {
        const result = await sequelize.transaction(async (t: any) => {
            const row: any = await ContactRecord.findOne({where: {userId: userId, contactId: contactId}});
            if (row && row.status === 2) {
                try {
                    await ContactRecord.update({status: 3}, {
                        where: {
                            [Op.and]: [
                                {userId: userId},
                                {contactId: contactId}
                            ]
                        },
                        transaction: t
                    })
                    await ContactRecord.update({status: 3}, {
                        where: {
                            [Op.and]: [
                                {userId: contactId},
                                {contactId: userId}
                            ]
                        },
                        transaction: t
                    })

                    await Contact.bulkCreate([
                        {userId: userId, contactId: contactId, contactName: targetName},
                        {contactId: userId, userId: contactId, contactName: originName}
                    ], {transaction: t})
                } catch (e) {
                    throw e;
                }

            } else {
                throw Error();
            }
        });
    } catch (error) {
        throw error;
    }
}

// 获取当前人和联系人的状态
async function getUserContactStatus(userId: string, contactId: string) {
    const row: any = await ContactRecord.findOne({
        where: {
            userId: userId,
            contactId: contactId
        }
    });
    return row && row.status;
}

// 获取当前用户的已添加的联系人
async function getYesContactList(userId: string) {
    const records = await query(`    
        select 
            xc.contact_id, if(isnull(xc.contact_name), xu.username, xc.contact_name) as name,xu.avatar_url
        from xinmi_contact xc inner join xinmi_user xu 
            on xu.user_id = xc.contact_id
        where xc.user_id = '${userId}'`);
    return records;
}

// 获取当前用户待确认的联系人
const getConfirmContactList = async (userId: string) => {
    return await query(`
            select
                xcr.contact_id,
                if(isnull(xc.contact_name), xu.username, xc.contact_name) as name,
                xcr.validate_msg,
                xu.avatar_url,
                xcr.status
            from xinmi_contact_record xcr
                     inner join xinmi_user xu
                     on xcr.contact_id = xu.user_id
                     left join xinmi_contact xc
                     on xcr.user_id = xc.user_id and xcr.contact_id = xc.contact_id
            where xcr.user_id = '${userId}';
  `);
};

// 获取当前用户的可添加的联系人
const getNoContactList = async (userId: string, username = "") => {
    return await query(`
    SELECT
        xu.user_id,
        xu.username,
        xu.avatar_url
    FROM
        xinmi_user xu
    WHERE
        xu.user_id NOT IN ( SELECT xc.contact_id FROM xinmi_contact xc WHERE xc.user_id = '${userId}' )
        AND xu.username LIKE '%${username}%'
        AND xu.user_id != '${userId}'
    `);
};

async function isContact(userId: string, contactId: string) {
    const contactor: any = await Contact.findOne({
        where: {
            userId: userId,
            contactId: contactId
        }
    });
    return !!contactor;
}

// 获取联系人详情,已经是联系人
async function getContactInfoHad(userId: string, contactId: string) {
    if (!isContact(userId, contactId)) {
        throw Error(`${userId}没有对应的联系人${contactId}`);
    }

    const contactor: any = await Contact.findOne({
        where: {
            userId: userId,
            contactId: contactId
        }
    });

    const contactorUserInfo: any = await User.findByPk(contactId);
    contactor.name = contactor.contactName || contactorUserInfo.username;
    contactor.username = contactorUserInfo.username;
    contactor.avatarUrl = contactorUserInfo.avatarUrl;

    return contactor;
};

// 获取联系人相关的提醒数量
async function getContactNoCheckedNum(userId: string) {
    return query(`
        select count(*) as num from xinmi_contact_record as xcr
        where xcr.user_id='${userId}'
        and xcr.status=2
        and (xcr.is_checked!=1 or xcr.is_checked is null)
    `);
};

async function setAllContactChecked(userId: string) {
    return await query(`
        update xinmi_contact_record as xcr set xcr.is_checked=1 WHERE xcr.user_id='${userId}'
    `, {type: QueryTypes.UPDATE});
};

/**
 * 编辑联系人信息
 *
 */
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
    try {
        const result = await sequelize.transaction(async (t: any) => {
            await messageDao.delMessageByPeople(userId, contactId);
            await chatDao.delChat(userId, contactId, {transaction: t});
            await query(`
               delete from xinmi_contact where user_id='${userId}' and contact_id='${contactId}' or user_id='${contactId}'
               and contact_id='${userId}'
            `, {transaction: t});
            await query(`
               delete from xinmi_contact_record where user_id='${userId}' and contact_id='${contactId}' or user_id='${contactId}'
               and contact_id='${userId}'
            `, {transaction: t})
        });
    } catch (error) {
    }
};

async function getContactListByUserId(userId: string) {
    const list = await Contact.findAll({
        where: {
            userId: userId
        }
    })

    return list;
};

export default {
    addContact,
    confirmContact,
    getUserContactStatus,
    getYesContactList,
    getConfirmContactList,
    getNoContactList,
    getContactInfoHad,
    getContactNoCheckedNum,
    setAllContactChecked,
    editContact,
    deleteContact,
    getContactListByUserId,
    isContact
}