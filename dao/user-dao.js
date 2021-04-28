const mysql = require('./mysql');
const util = require('../util/index');
const uuid = util.uuid;

const getUserList = async () => {
    return await mysql.query('select * from xinmi_user');
}

const insertUser = async (obj) => {
    return await mysql.query(`
    insert into xinmi_user (id, username, password, email_address) values 
    (uuid(), '${obj.username}', '${obj.password}', '${obj.emailAddress}')
  `)
}

const updateUser = async (obj) => {
    let arr = [];
    if (obj.username) {
        arr.push(`username='${obj.username}'`)
    }
    if (obj.password) {
        arr.push(`password='${obj.password}'`)
    }
    if (obj.avatarUrl) {
        arr.push(`avatar_url='${obj.avatarUrl}'`)
    }
    if (obj.bgUrl) {
        arr.push(`bg_url='${obj.bgUrl}'`)
    }
    sql = `UPDATE xinmi_user SET ${arr.join(',')} WHERE id = '${obj.id}'`
    return await mysql.query(sql);
}

const getUserDetail = async ({userId, username, emailAddress, password}) => {
    let arr = [];
    let conditionStr = '';
    if (userId) {
        arr.push(`id='${userId}'`);
    }
    if (username) {
        arr.push(`username='${username}'`);
    }
    if (emailAddress) {
        arr.push(`email_address='${emailAddress}'`);
    }
    if (password) {
        arr.push(`password='${password}'`);
    }
    conditionStr = arr.join(' and ');

    return await mysql.query(
        `select 
            user.id, 
            user.username, 
            user.avatar_url,
            user.bg_url,
            user.email_address
        from xinmi_user user 
        where ${conditionStr}`
    )
}

const getMaxXinmiId = async () => {
    return await mysql.query(
        `SELECT max(username) as xm_id FROM xinmi_user`
    )
}

const updatePasswordByEmailAddress = async (password, emailAddress) => {
    return await mysql.query(
        `update xinmi_user set password='${password}' where email_address='${emailAddress}'`
    )
}

const editEmailAddress = async ({originEmailAddress, targetEmailAddress, password}) => {
    return await mysql.query(
        `update xinmi_user set email_address='${targetEmailAddress}' where email_address='${originEmailAddress}' and password='${password}'`
    )
}

module.exports = {
    getUserList,
    insertUser,
    getUserDetail,
    updateUser,
    getMaxXinmiId,
    updatePasswordByEmailAddress,
    editEmailAddress
}