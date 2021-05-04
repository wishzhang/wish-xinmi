import mysql = require('./mysql');
import util = require('../util');
import Daogenerator = require('./dao-generator');

const baseDao = Daogenerator({
    tableName: 'xinmi_user',
    columns: [
        {name: 'id', type: Daogenerator.columnGType.uuid},
        {name: 'username', type: Daogenerator.columnGType.string},
        {name: 'password', type: Daogenerator.columnGType.string},
        {name: 'avatar_url', type: Daogenerator.columnGType.string},
        {name: 'bg_url', type: Daogenerator.columnGType.string},
        {name: 'email_address', type: Daogenerator.columnGType.string}
    ]
})

const uuid = util.uuid;

const getUserList = async () => {
    return await mysql.query('select * from xinmi_user');
}

const updateUser = async (obj: any) => {
    const {id, username, password, avatarUrl, bgUrl} = obj;

    const searchColumns = [
        {name: 'id', value: id}
    ];
    const dataObj = {
        'username': username,
        'password': password,
        'avatar_url': avatarUrl,
        'bg_url': bgUrl
    }
    return await baseDao.update({
        wheres: searchColumns,
        set: dataObj
    });
}

const getUserDetail = async (userId?: string, emailAddress?: string) => {
    return await baseDao.getOne({
        wheres: [
            {name: 'id', value: userId, signs: ['equal']},
            {name: 'email_address', value: emailAddress, signs: ['and', 'equal']},
        ]
    })
}

const getMaxXinmiId = async () => {
    return await mysql.query(
        `SELECT max(username) as xm_id FROM xinmi_user`
    )
}

const updatePasswordByEmailAddress = async (password:string, emailAddress:string) => {
    return await mysql.query(
        `update xinmi_user set password='${password}' where email_address='${emailAddress}'`
    )
}

const editEmailAddress = async (originEmailAddress:string, targetEmailAddress:string, password:string) => {
    return await mysql.query(
        `update xinmi_user set email_address='${targetEmailAddress}' 
        where email_address='${originEmailAddress}' 
        and password='${password}'`
    )
}

const findOne = async (obj: any) => {
    const {userId, username, emailAddress, password} = obj;
    return await baseDao.getOne({
        wheres: [
            {name: 'id', value: userId, signs: ['equal']},
            {name: 'username', value: username, signs: ['and', 'like']},
            {name: 'email_address', value: emailAddress, signs: ['and', 'equal']},
            {name: 'password', value: password, signs: ['and', 'equal']},
        ]
    })
}

export = {
    getUserList,
    getUserDetail,
    updateUser,
    getMaxXinmiId,
    updatePasswordByEmailAddress,
    editEmailAddress,
    findOne,
    ...baseDao
}