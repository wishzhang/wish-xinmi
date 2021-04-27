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

const updateUser = async (obj) => {
    let arr = [];
    if (obj.username) {
        arr.push(`username='${obj.username}'`)
    } else if (obj.password) {
        arr.push(`password='${obj.password}'`)
    } else if (obj.avatarUrl) {
        arr.push(`avatar_url='${obj.avatarUrl}'`)
    } else if (obj.bgUrl) {
        arr.push(`bg_url='${obj.bgUrl}'`)
    }
    sql = `UPDATE xinmi_user SET ${arr.join(',')} WHERE id = '${obj.id}'`
    return await mysql.query(sql);
}

const getUserDetail = async ({userId, username}) => {
    let arr = [];
    let conditionStr = '';
    if (userId) {
        arr.push(`id='${userId}'`);
    } else if (username) {
        arr.push(`username='${username}'`);
    }
    conditionStr = arr.join(',');

    return await mysql.query(
        `select 
            user.id, 
            user.username, 
            user.avatar_url,
            user.bg_url
        from xinmi_user user 
        where ${conditionStr}`
    )
}

module.exports = {
    getUserList,
    insertUser,
    getUserDetail,
    updateUser
}