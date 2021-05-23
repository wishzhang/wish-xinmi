import {Contact, User, Message, Chat} from "./model";
import {ContactRecord} from "./model";
import {sequelize, Op, query, QueryTypes} from './sequelize';
import chatDao from "./chat-dao";
import messageDao from "./message-dao";
import contactRecordDao from './contact-record-dao';
import debug from '../util/debug';

const log = debug('contact-dao');

// 获取当前用户的已添加的联系人
async function getYesContactList(userId: string) {
    const records = await query(`    
        select 
            xc.contact_id, if(isnull(xc.contact_name), xu.username, xc.contact_name) as name,xu.avatar_url
        from xinmi_contact xc inner join xinmi_user xu 
            on xu.user_id = xc.contact_id
        where xc.user_id = '${userId}' and xc.deleted_at is null`
    );
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
            where xcr.user_id = '${userId}' and xcr.deleted_at is null;
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
        xu.user_id NOT IN ( SELECT xc.contact_id FROM xinmi_contact xc WHERE xc.user_id = '${userId}' and xc.deleted_at is null)
        AND xu.username LIKE '%${username}%'
        AND xu.user_id != '${userId}'
        and xu.deleted_at is null
    `);
};

async function isContact(userId: string, contactId: string, isAll = false) {
    const contactor: any = await Contact.findOne({
        where: {
            userId: userId,
            contactId: contactId
        },
        paranoid: !isAll
    });
    return contactor !== null;
}

// 获取联系人详情,已经是联系人
async function getContactInfoHad(userId: string, contactId: string) {
    const is = await isContact(userId, contactId);
    if (!is) {
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
        and xcr.deleted_at is null
    `);
};

async function setAllContactChecked(userId: string) {
    return await query(`
        update xinmi_contact_record as xcr set xcr.is_checked=1 WHERE xcr.user_id='${userId}'
        and xcr.deleted_at is null
    `, {type: QueryTypes.UPDATE});
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
    getYesContactList,
    getConfirmContactList,
    getNoContactList,
    getContactInfoHad,
    getContactNoCheckedNum,
    setAllContactChecked,
    getContactListByUserId,
    isContact
}