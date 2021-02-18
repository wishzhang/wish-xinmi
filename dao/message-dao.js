const mysql = require('./mysql');
const util = require('../util/index');
const uuid = util.uuid;

const getContactMessageList = async ({originUser, targetUser}) => {
    const resList = await mysql.query(`
        SELECT
         xm.*, xu.avatar_url
        FROM
            xinmi_message xm
            INNER JOIN xinmi_user xu ON xm.origin_user = xu.id
        WHERE
            ( xm.origin_user = '${originUser}' AND xm.target_user = '${targetUser}' ) 
            OR ( xm.origin_user = '${targetUser}' AND xm.target_user = '${originUser}' ) 
        ORDER BY
            xm.create_time ASC
    `);
    return util.toHumpList(resList);
}

/*
根据chatid查询聊天信息
*/
const getContactMessageListByChatId = async (chatId) => {
    const list = await mysql.query(`
     select
        * 
        from
        xinmi_message xm
        inner join xinmi_user xu on xm.origin_user = xu.id 
        where
        xm.chat_id = '${chatId}' 
      `)
    return list;
}

const getMineAllChatList = async ({userId}) => {
    const list = await mysql.query(`
      SELECT
          xm.*,
          xu.avatar_url,
          xcon.contact_name AS towards_name
      FROM
          ( SELECT chat_id, max( create_time ) AS create_time FROM xinmi_message WHERE origin_user = '${userId}' 
          OR target_user = '${userId}' GROUP BY chat_id ) a
          INNER JOIN xinmi_message xm ON xm.chat_id = a.chat_id 
          AND xm.create_time = a.create_time
          INNER JOIN xinmi_contact xcon ON (xm.target_user = xcon.contact_id OR xm.origin_user = xcon.contact_id)
          AND xcon.user_id = '${userId}'
          INNER JOIN xinmi_user xu ON xcon.contact_id = xu.id
    `)
    return list;
}

// 添加一条消息: 如果没有chat就添加chat,有就更新
const addMessage = async ({originUser, targetUser, content}) => {
    const list = await getContactMessageList({originUser, targetUser});
    if (Array.isArray(list) && list.length === 0) {
        const chatId = uuid();
        await mysql.transaction([
            () => {
                return `
        insert into xinmi_chat (chat_id, user_id, create_time) values 
        ('${chatId}', '${originUser}', now()),
        ('${chatId}', '${targetUser}', now())
      `;
            },
            () => {
                return `
        insert into xinmi_message 
        (message_id, content, chat_id, create_time, origin_user, target_user) values 
        (uuid(), '${content}', '${chatId}', now(), '${originUser}', '${targetUser}')
      `
            }
        ])
    } else if (Array.isArray(list) && list.length > 0) {
        const chatId = list[0].chatId;
        await mysql.query(`
        insert into xinmi_message (message_id, content, chat_id, create_time, origin_user, target_user) values 
        (uuid(), '${content}', '${chatId}', now(), '${originUser}', '${targetUser}')
      `);
    }
}

module.exports = {
    addMessage,
    getContactMessageList,
    getMineAllChatList,
    getContactMessageListByChatId
}

