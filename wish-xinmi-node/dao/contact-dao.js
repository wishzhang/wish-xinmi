const mysql = require('./mysql');
const util = require('../util/index');
const uuid = util.uuid;

// 当用户添加联系人
const addContact = async ({userId, contactId, validateMsg = '', originName, targetName}) => {
    // 如果对方已给自己发送了验证消息，则将对方-自己 更新3，并且将自己-对方更新3
    // 如果对方没有，则给对方-自己 插入2，自己-对方 插入1
    const rows = await getUserContactStatus({userId: contactId, contactId: userId});
    if (rows.length > 0) {
        const status = rows[0].status;
        if (status === 1) {
            await mysql.transaction([
                () => {
                    return `
          update xinmi_contact 
          set status = 3, update_time = now()
          where user_id = '${userId}' and contact_id = '${contactId}'
        `
                },
                () => {
                    return `
          update xinmi_contact set 
          status = 3, update_time = now()
          where user_id = '${contactId}' and contact_id = '${userId}'
        `
                }
            ])
        }
    } else {
        await mysql.transaction([
            () => {
                return `
          insert into xinmi.xinmi_contact 
          (
            user_id, contact_id, status, 
            validate_msg, contact_name,create_time, 
            update_time
          )
          values 
          (
            '${userId}', '${contactId}', 1, 
            '${validateMsg}', '${targetName}', now(), 
            now()
          )
        `
            },
            () => {
                return `
          insert into xinmi.xinmi_contact
          (
            user_id, contact_id, status, 
            validate_msg, contact_name,create_time, 
            update_time
          )
          values
          (
            '${contactId}', '${userId}', 2, 
            '${validateMsg}', '${originName}', now(), 
            now()
          )
      `
            }
        ]);
    }
}

// 确认联系人
const confirmContact = async ({userId, contactId}) => {
    await mysql.transaction([
        () => {
            return `
    update xinmi_contact
      set status = 3, update_time = now()
            where user_id = '${userId}'
              and contact_id = '${contactId}'
  `
        },
        () => {
            return `
    update xinmi_contact
      set status = 3, update_time = now()
            where user_id = '${contactId}'
              and contact_id = '${userId}'
  `
        }
    ])
}

// 获取当前人和联系人的状态
const getUserContactStatus = async ({userId, contactId}) => {
    return await mysql.query(`
   select status
      from xinmi_contact
      where user_id = '${userId}' and contact_id = '${contactId}'
  `)
}

// 获取当前用户的已添加的联系人
const getYesContactList = async ({userId}) => {
    return await mysql.query(`
    select xu.id, xu.username,xu.avatar_url
    from xinmi_user xu
             inner join xinmi_contact xc 
             on xu.id = xc.contact_id and xc.status = 3
    where xc.user_id = '${userId}'
  `)
}

// 获取当前用户待确认的联系人
const getConfirmContactList = async ({userId}) => {
    return await mysql.query(`
        select 
            xu.id, 
            xu.username, 
            xc.validate_msg,
            xu.avatar_url
        from xinmi_user xu
                 inner join xinmi_contact xc 
                 on xu.id = xc.contact_id and xc.status = 2
        where xc.user_id = '${userId}'
  `)
}

// 获取当前用户的可添加的联系人
const getNoContactList = async ({userId, username}) => {
    return await mysql.query(`
        select 
            xu.id, 
            xu.username,
            xu.avatar_url
          from xinmi_user xu
          where xu.id not in (
            select xc.contact_id from xinmi_contact xc where xc.user_id = '${userId}' and xc.status =3
          )
            and xu.username like '%${username}%'
            and xu.id != '${userId}'
    `)
}

// 获取联系人详情,已经是联系人
const getContactInfoHad= async ({userId, contactId}) => {
    return await mysql.query(`
        SELECT
            xu.id,
            xc.contact_name,
            xu.avatar_url,
            xu.bg_url 
        FROM
            xinmi_contact xc
            INNER JOIN xinmi_user xu ON xc.contact_id = xu.id 
        WHERE
            xc.user_id = '${userId}' 
            AND xc.contact_id = '${contactId}'
            AND xc.status=3
    `)
}

module.exports = {
    addContact,
    getYesContactList,
    confirmContact,
    getNoContactList,
    getConfirmContactList,
    getUserContactStatus,
    getContactInfoHad
}