import {DataTypes} from 'sequelize';
import {sequelize, Sequelize} from './sequelize';
import mysql from 'mysql2/promise';
import config from '../config';
import debug from '../util/debug';

const log = debug('db');

/**
 * 定义表
 */
export const Chat = sequelize.define('Chat',
    {
        chatId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        }
    }, {
        tableName: 'xinmi_chat'
    });

export const ChatMember = sequelize.define('ChatMember',
    {
        chatId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
        },
        userId: {
            type: DataTypes.UUID,
        },
    }, {
        tableName: 'xinmi_chat_member'
    });

export const Thought = sequelize.define('Thought',
    {
        thoughtId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        createUser: {
            type: DataTypes.UUID,
        },
        content: {
            type: DataTypes.STRING
        },
        photosUrl: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'xinmi_thought'
    });

export const User = sequelize.define('User',
    {
        userId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        avatarUrl: {
            type: DataTypes.STRING
        },
        bgUrl: {
            type: DataTypes.STRING
        },
        emailAddress: {
            type: DataTypes.STRING
        },
    }, {
        tableName: 'xinmi_user'
    });

export const Contact = sequelize.define('Contact',
    {
        userId: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: 'userId'
            }
        },
        contactId: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: 'userId'
            }
        },
        contactName: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'xinmi_contact'
    });

export const ContactRecord = sequelize.define('ContactRecord',
    {
        userId: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: 'userId'
            }
        },
        contactId: {
            type: DataTypes.UUID,
            references: {
                model: User,
                key: 'userId'
            }
        },
        status: {
            type: DataTypes.INTEGER
        },
        validateMsg: {
            type: DataTypes.STRING
        },
        isChecked: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'xinmi_contact_record'
    });

export const Message = sequelize.define('Message',
    {
        messageId: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true
        },
        originUser: {
            type: DataTypes.UUID,
        },
        chatId: {
            type: DataTypes.UUID,
        },
        content: {
            type: DataTypes.STRING
        },
        isChecked: {
            type: DataTypes.STRING
        }
    }, {
        tableName: 'xinmi_message',
    });

// 创建数据库和表
export async function setupDatabase() {
    // 创建数据库
    const connection = await mysql.createConnection({
        host: config.mysql.host,
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.password
    });

    let sql = `CREATE DATABASE IF NOT EXISTS \`${config.mysql.database}\`;`;
    log(sql);
    await connection.query(sql);

    // 数据库表关联
    User.belongsToMany(User, {through: 'Contact', as: 'tmp1', foreignKey: 'userId'});
    User.belongsToMany(User, {through: 'Contact', as: 'tmp2', foreignKey: 'contactId'});

    User.belongsToMany(User, {through: 'ContactRecord', as: 'tmp3', foreignKey: 'userId'});
    User.belongsToMany(User, {through: 'ContactRecord', as: 'tmp4', foreignKey: 'contactId'});

    User.hasMany(Thought, {
        foreignKey: 'createUser'
    })

    Chat.belongsToMany(User, {through: 'ChatMember', as: 'tmp5', foreignKey: 'chatId'});
    User.belongsToMany(Chat, {through: 'ChatMember', as: 'tmp6', foreignKey: 'userId'});

    await User.sync()
    await Contact.sync()
    await ContactRecord.sync()
    await Chat.sync()
    await ChatMember.sync()
    // 初次创建数据库表的时候，这里加不了主外键关联，要去数据库设置xinmi_message表
    await Message.sync()
    await Thought.sync()
}


