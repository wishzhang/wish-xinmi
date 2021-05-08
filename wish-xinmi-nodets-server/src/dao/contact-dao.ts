import mysql = require("./mysql");
import util = require("../util");
import Daogenerator = require("./dao-generator");
import userDao = require("./user-dao");
import contactDao = require("./contact-dao");

const baseDao = Daogenerator({
    tableName: "xinmi_contact",
    columns: [
        {name: "user_id", type: Daogenerator.columnGType.string},
        {name: "contact_id", type: Daogenerator.columnGType.string},
        {name: "contact_name", type: Daogenerator.columnGType.string},
        {name: "create_time", type: Daogenerator.columnGType.datetime},
        {name: "update_time", type: Daogenerator.columnGType.datetime},
    ]
});

const uuid = util.uuid;

/**
 * 当用户发送验证消息给联系人（不做校验），那么：
 * 如果对方已经发给自己确认信息了，则直接添加为联系人{
 *     将两条握手记录状态置为3，
 *     再插入两条记录到联系表里
 * }
 * 如果没有，给自己-对方状态1、对方-自己状态2
 *
 *
 * @param userId
 * @param contactId
 * @param validateMsg
 * @param originName
 * @param targetName
 * @returns {Promise<void>}
 */
const addContact = async (
    userId: string,
    contactId: string,
    originName: string,
    targetName: string,
    validateMsg?: string) => {

    const rows: any = await getUserContactStatus(contactId, userId);
    if (rows.length > 0) {
        const status = rows[0].status;
        if (status === 1) {
            await mysql.transaction([
                () => {
                    return `
                      update xinmi_contact_record 
                      set status = 3, update_time = now()
                      where user_id = '${userId}' and contact_id = '${contactId}'
                      `;
                },
                () => {
                    return `
                      update xinmi_contact_record set 
                      status = 3, update_time = now()
                      where user_id = '${contactId}' and contact_id = '${userId}'
                      `;
                },
                () => {
                    return `
                  insert into xinmi.xinmi_contact 
                      (user_id, contact_id, contact_name, create_time, update_time)
                  values 
                      ('${userId}', '${contactId}', '${targetName}', now(), now()),
                      ('${contactId}', '${userId}', '${originName}', now(), now())
                `;
                }
            ]);
            return 3;
        }
    } else {
        await mysql.transaction([
            () => {
                return `
                  insert into xinmi.xinmi_contact_record
                      (user_id, contact_id, status, validate_msg, create_time, update_time)
                  values 
                      ('${userId}', '${contactId}', 1, '${validateMsg}', now(), now()),
                      ('${contactId}', '${userId}', 2, '${validateMsg}', now(), now())
                `;
            }
        ]);
        return 1;
    }
};

// 确认联系人
const confirmContact = async (obj: any) => {
    const {userId, contactId, originName, targetName} = obj;

    await mysql.transaction([
        () => {
            return `
                update xinmi_contact_record
                  set status = 3, update_time = now()
                        where user_id = '${userId}'
                          and contact_id = '${contactId}'
            `;
        },
        () => {
            return `
                update xinmi_contact_record
                  set status = 3, update_time = now()
                        where user_id = '${contactId}'
                          and contact_id = '${userId}'
            `;
        },
        () => {
            return `
                  insert into xinmi.xinmi_contact 
                      (user_id, contact_id, contact_name, create_time, update_time)
                  values 
                      ('${userId}', '${contactId}', '${targetName}', now(), now()),
                      ('${contactId}', '${userId}', '${originName}', now(), now())
                `;
        }
    ]);
};

// 获取当前人和联系人的状态
const getUserContactStatus = async (userId: string, contactId: string) => {
    return await mysql.query(`
   select status
      from xinmi_contact_record
      where user_id = '${userId}' and contact_id = '${contactId}'
  `);
};

// 获取当前用户的已添加的联系人
const getYesContactList = async (userId: string) => {
    return await mysql.query(`
    select xc.contact_id, if(isnull(xc.contact_name), xu.username, xc.contact_name) as name,xu.avatar_url
    from xinmi_contact xc inner join xinmi_user xu on xu.id = xc.contact_id
    where xc.user_id = '${userId}'
  `);
};

// 获取当前用户待确认的联系人
const getConfirmContactList = async (userId: string) => {
    return await mysql.query(`
            select 
                xcr.contact_id, 
                if(isnull(xc.contact_name), xu.username, xc.contact_name) as name,
                xcr.validate_msg,
                xu.avatar_url,
                xcr.status
            from xinmi_contact_record xcr
                     inner join xinmi_user xu
                     on xcr.contact_id = xu.id
                     left join xinmi_contact xc
                     on xcr.user_id = xc.user_id and xcr.contact_id = xc.contact_id
            where xcr.user_id = '${userId}';
  `);
};

// 获取当前用户的可添加的联系人
const getNoContactList = async (userId: string, username="") => {
    return await mysql.query(`
    SELECT
        xu.id,
        xu.username,
        xu.avatar_url 
    FROM
        xinmi_user xu 
    WHERE
        xu.id NOT IN ( SELECT xc.contact_id FROM xinmi_contact xc WHERE xc.user_id = '${userId}' ) 
        AND xu.username LIKE '%${username}%' 
        AND xu.id != '${userId}'
    `);
};

// 获取联系人详情,已经是联系人
const getContactInfoHad = async (userId: string, contactId: string) => {

    const contactor = await baseDao.getOne({
        wheres: [
            {name: "user_id", value: userId, signs: ["equal"]},
            {name: "contact_id", value: contactId, signs: ["and", "equal"]},
        ]
    });

    const contactorUserInfo = await userDao.getUserDetail(contactId);
    contactor.name = contactor.contactName || contactorUserInfo.username;
    contactor.username = contactorUserInfo.username;
    contactor.avatarUrl = contactorUserInfo.avatarUrl;

    return contactor;
};

// 获取联系人相关的提醒数量
const getContactNoCheckedNum = async (userId: string) => {
    return await mysql.query(`
        select count(*) as num from xinmi_contact_record as xcr
        where xcr.user_id='${userId}' 
        and xcr.status=2
        and (xcr.is_checked!=1 or xcr.is_checked is null)
    `);
};

const setAllContactChecked = async (userId: string) => {
    return await mysql.query(`
        update xinmi_contact_record as xcr set xcr.is_checked=1 WHERE xcr.user_id='${userId}'
    `);
};

/**
 * 编辑联系人信息
 *
 */
const editContact = async (userId: string, contactId: string, contactName: string) => {

    const arr = [];
    let conStr = "";
    arr.push(`contact_name='${contactName}'`);
    conStr = arr.join(",");

    return await mysql.query(`
        update xinmi_contact set ${conStr} where xinmi_contact.user_id='${userId}' 
        and xinmi_contact.contact_id='${contactId}'
    `);
};

const deleteContact = async (userId: string, contactId: string) => {
    await mysql.transaction([
        () => {
            return require('./message-dao').delMessageByPeople(userId, contactId);
        },
        () => {
            return require("./chat-dao").delChat(userId,contactId);
        },
        () => {
            return `
       delete from xinmi_contact where user_id='${userId}' and contact_id='${contactId}' or user_id='${contactId}' 
       and contact_id='${userId}'
            `;
        },
        () => {
            return `
           delete from xinmi_contact_record where user_id='${userId}' and contact_id='${contactId}' or user_id='${contactId}' 
           and contact_id='${userId}'
            `;
        }
    ]);
};

const getContactListByUserId = async (userId: string) => {
    const list = await baseDao.getList({
        wheres: [
            {name: "userId", value: userId, signs: ["equal"]}
        ]
    });

    return list;
};

export = {
    addContact,
    getYesContactList,
    confirmContact,
    getNoContactList,
    getConfirmContactList,
    getUserContactStatus,
    getContactInfoHad,
    getContactNoCheckedNum,
    setAllContactChecked,
    editContact,
    deleteContact,
    ...baseDao
}