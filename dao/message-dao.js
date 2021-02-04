const mysql = require('./mysql');
const util = require('../util/index');
const uuid = util.uuid;

const getContactMessageList = async ({originUser, targetUser}) => {
  const list = await mysql.query(`
        select
          xcm1.chat_id 
        from
          xinmi_chat AS xcm1 
        where
          xcm1.user_id = '${originUser}' 
          and xcm1.chat_id IN 
          ( select xcm2.chat_id from xinmi_chat as xcm2 where xcm2.user_id = '${targetUser}' )
      `)
  if (Array.isArray(list) && list.length > 0) {
    const chatId = list[0].chat_id;
    const resList = await mysql.query(`
        select * 
        from xinmi_message 
          where chat_id = '${chatId}'
          order by create_time asc
    `);
    return util.toHumpList(resList);
  }
  return [];
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
    select
    xm.*, xcon.contact_name as target_name, xcon2.contact_name as origin_name
    from
    ( select chat_id, max( create_time ) as create_time from xinmi_message 
    where origin_user = '${userId}' or target_user = '${userId}' group by chat_id ) a
    inner join xinmi_message xm on xm.chat_id = a.chat_id 
    and xm.create_time = a.create_time
    inner join xinmi_contact xcon on xm.target_user = xcon.contact_id and xm.origin_user = xcon.user_id
    inner join xinmi_contact xcon2 on xm.origin_user = xcon2.contact_id and xm.target_user = xcon2.user_id
    order by xm.create_time desc
    `)
  return list;
}

// 添加一条消息: 如果没有chat就添加chat,有就更新
const addMessage = async ({originUser, targetUser, content}) => {
  const list = await mysql.query(`
        select
          xcm1.chat_id 
        from
          xinmi_chat as xcm1 
        where
          xcm1.user_id = '${originUser}' 
          and xcm1.chat_id in 
          ( select xcm2.chat_id from xinmi_chat as xcm2 where xcm2.user_id = '${targetUser}' )
      `)
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
    const chatId = list[0].chat_id;
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

