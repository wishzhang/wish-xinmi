import {Sequelize, Op, QueryTypes} from 'sequelize';
import config from "../config";

const sequelize: any = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    define: {
        timestamps: true,
        paranoid: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        underscored: true,
        charset: 'utf8'
    },
    query: {
        raw: true
    },
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    }
});

async function query(sql: string, options?: any) {
    let o = Object.assign({}, {type: QueryTypes.SELECT, row: true}, options);
    const rows = await sequelize.query(sql, o);
    return rows;
}

async function queryPage(sql: string, current = 1, size = 10) {
    const totalSql = `select count(*) as total from (${sql}) as tmp`;
    try{
        const rows: any = await query(totalSql);
        const list = await query(`${sql} limit ${(current - 1) * size},${size}`);
        let total = rows && rows.length ? rows[0].total : 0;
        return {
            current,
            size,
            total: total,
            records: list
        };
    }catch (e) {
        console.log(e);
    }


}

export {
    sequelize,
    Op,
    query,
    queryPage,
    Sequelize,
    QueryTypes
}
