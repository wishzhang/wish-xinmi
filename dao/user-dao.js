const mysql = require('./mysql');
const util = require('../util/index');
const uuid = util.uuid;

const getUserList = async () => {
  return await mysql.query('select * from xinmi_user');
}

const insertUser = async (obj) => {
  return await mysql.query(`
    insert into xinmi_user (id, username, password) values 
    (uuid(), '${obj.username}', '${obj.password}')
  `)
}

const getUserDetail = async ({userId}) => {
  return await mysql.query(
    `select user.id, user.username from xinmi_user user where user.id = '${userId}'`
  )
}

module.exports = {
  getUserList,
  insertUser,
  getUserDetail
}