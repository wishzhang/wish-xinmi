import {Sequelize, Op, QueryTypes} from 'sequelize';
import config from "../config";
import debug from '../util/debug';
import util from '../util/index'

const log = debug('db');

const sequelize: any = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    define: {
        timestamps: true,
        paranoid: true,
        underscored: true,
        charset: 'utf8'
    },
    query: {
        raw: true
    },
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
    logging: (...msg) => {
        if (msg.length > 0) {
            log(msg[0]);
        } else {
            log(msg);
        }
    },
});

async function query(sql: string, options?: any) {
    let o = Object.assign({}, {type: QueryTypes.SELECT, raw: true}, options);
    let rows = await sequelize.query(sql, o);
    rows = util.toHumpList(rows);
    return rows;
}

async function queryPage(sql: string, current = 1, size = 10) {
    const totalSql = `select count(*) as total from (${sql}) as tmp`;
    const rows: any = await query(totalSql);
    let list = await query(`${sql} limit ${(current - 1) * size},${size}`);
    list = util.toHumpList(list);

    let total = rows && rows.length ? rows[0].total : 0;
    return {
        current,
        size,
        total: total,
        records: list
    };
}

export {
    sequelize,
    Op,
    query,
    queryPage,
    Sequelize,
    QueryTypes
}
