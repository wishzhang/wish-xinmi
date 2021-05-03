const mysql = require('./mysql');
const util = require('../util/index');
const uuid = util.uuid;
const DaoGenerator = require('./dao-generator');


const baseDao = DaoGenerator({
    tableName: 'xinmi_user',
    columns: [
        {name: 'id', type: DaoGenerator.columnGType.uuid},
        {name: 'username'},
        {name: 'password'},
        {name: 'avatar_url'},
        {name: 'bg_url'},
        {name: 'email_address'}
    ]
})

const getUserList = async () => {
    return await mysql.query('select * from xinmi_user');
}

const updateUser = async (obj) => {
    const searchColumns = [
        {name: id, value: obj.id}
    ];
    const dataObj = {
        'username': obj.username,
        'password': obj.password,
        'avatar_url': obj.avatarUrl,
        'bg_url': obj.bgUrl
    }
    return await baseDao.update({
        searchs: searchColumns,
        set: dataObj
    });
}

const getUserDetail = async ({userId, username, emailAddress, password}) => {
    return await baseDao.getOne({
        searchs: [
            {name: 'id', value: userId, signs: ['equal']},
            {name: 'username', value: username, signs: ['and', 'like']},
            {name: 'email_address', value: emailAddress, signs: ['and', 'equal']},
            {name: 'password', value: password, signs: ['and', 'equal']},
        ]
    })
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
    getUserDetail,
    updateUser,
    getMaxXinmiId,
    updatePasswordByEmailAddress,
    editEmailAddress,
    ...baseDao
}