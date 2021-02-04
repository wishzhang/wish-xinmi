const messageDao = require('../dao/message-dao');
const util = require('../util/index');
const datetime = require('../util/datetime');

const addMessage = async ({originUser, targetUser, content}) => {
  return await messageDao.addMessage({originUser, targetUser, content});
}

const getContactMessageList = async ({originUser, targetUser}) => {
  return await messageDao.getContactMessageList({originUser, targetUser});
}

const getMineAllChatList = async ({userId}) => {
  const list = await messageDao.getMineAllChatList({userId});
  list.forEach(el => {
    el.createTime = datetime.dateFromNow(el.createTime);
  });
  return list;
}

module.exports = {
  addMessage,
  getContactMessageList,
  getMineAllChatList
}