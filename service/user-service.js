const userDao = require('../dao/user-dao');

const getUserList = async () => {
  return await userDao.getUserList();
}

const insertUser = async (obj) => {
  return await userDao.insertUser(obj);
}

const getUserDetail = async ({userId}) => {
  const list = await userDao.getUserDetail({userId});
  if (list.length > 0) {
    return list[0];
  } else {
    return null;
  }
}

module.exports = {
  getUserList,
  insertUser,
  getUserDetail
}