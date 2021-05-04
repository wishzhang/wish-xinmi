/**
 * 思路：没有分词的步骤，直接定义ast树，根据ast树直接生成对应的代码,
 */
import util = require('../util');
import mysql = require('./mysql');

const columnGType = {
    string: 1,
    number: 2,
    uuid: 3,
    datetime: 4
}

const fillSpace = (str: any) => {
    return ` ${str} `
}

function getCellSqlValue(name: any, cellValue: any) {
    return typeof cellValue === 'string' ? `'${cellValue}'` : cellValue;
}

const canInsertValueType = ['string', 'number'];

const searchGSign = {
    and: 'and',
    or: 'or',
    equal: 'equal',
    like: 'like',
    desc: 'desc',
    asc: 'asc'
}

const createSearchString = (searchColumns: any) => {
    if (!Array.isArray(searchColumns)) throw TypeError();

    let searchStr = searchColumns.map(searchColumn => {
        let fieldStr = getSearchFieldStr(searchColumn);
        return fieldStr;
    }).join(' ');

    // 纠错
    searchStr = searchStr.trim();
    if (searchStr) {
        const arr = searchStr.split(/\s+/);
        const firstWord = arr.length > 0 ? arr[0] : '';
        if (firstWord.startsWith('order')) {

        } else {
            if (searchGSign.hasOwnProperty(firstWord)) {
                searchStr = searchStr.replace(firstWord, '');
            }
            searchStr = ` where ${searchStr}`;
        }
    }

    // 获取一个字段的sql搜索字符串
    function getSearchFieldStr(searchColumn: any) {
        const {name, value, signs = []} = searchColumn;

        let str = '';
        let tmp = '';

        for (let sign of signs) {
            tmp = '';
            // 有些未传参的字段，不需要去查。有些需要
            if (typeof value !== 'undefined') {
                if (sign === 'and') {
                    tmp = 'and';
                } else if (sign === 'or') {
                    tmp = 'or';
                } else if (sign === 'equal') {
                    const val = getCellSqlValue(name, value);
                    tmp = `${name}=${val}`;
                } else if (sign === 'unequal') {
                    const val = getCellSqlValue(name, value);
                    tmp = `${name}!=${val}`;
                } else if (sign === 'like') {
                    tmp = `${name} like '%${value}%'`;
                }
            }

            str += fillSpace(tmp);

            tmp = '';
            if (sign === 'desc') {
                tmp = `order by ${name} desc`;
            } else if (sign === 'asc') {
                tmp = `order by ${name} asc`;
            } else if (sign === 'null') {
                tmp = `${name} is null`;
            }
            str += fillSpace(tmp);
        }

        return str;
    }

    return searchStr;
}

const DaoGenerator = function (ast: any) {
    const {tableName, columns} = ast;

    if (!tableName || !Array.isArray(columns)) {
        throw TypeError();
    }

    const columnNames = columns.map(el => {
        return el.name;
    });

    const getcolumnGType = (name: any) => {
        const row = columns.find(el => el.name === name);
        return row && row.type || columnGType.string;
    }

    const getCellValue = (name: any, val: any) => {
        if (val && !canInsertValueType.includes(typeof val)) {
            throw TypeError();
        }

        let cellValue;
        const type = getcolumnGType(name);
        if (type === columnGType.number) {
            cellValue = val || 0;
        } else if (type === columnGType.string) {
            cellValue = `'${val}'`;
        } else if (type === columnGType.uuid) {
            cellValue = val || 'uuid()';
        } else if (type === columnGType.datetime) {
            cellValue = val || 'now()';
        }
        return cellValue;
    }

    /**
     * 插入语句
     * @param data
     * @returns {Promise<any>}
     */
    const insert = async (data: any[] | object) => {
        let res: any;

        if (!Array.isArray(data) && !util.isPlainObject(data) || Array.isArray(data) && data.length === 0) {
            throw TypeError();
        }

        data = util.isPlainObject(data) ? [data] : data;

        let valueStr = (data as any []).map((row: any) => {
            let rowStr = columnNames.map(name => {
                const cellValue = getCellValue(name, row[name]);
                return cellValue;
            }).join(',');
            rowStr = `(${rowStr})`;
            return rowStr;
        });

        let columnStr = `(${columnNames.join(',')})`;

        res = await mysql.query(`insert into ${tableName} ${columnStr} values ${valueStr}`);
        if (res && res.length > 0) {
            res = res.length > 1 ? res : res[0];
        }

        return res;
    }

    /**
     * 查询一个语句
     * @param searchColumns
     */
    const getOne = async ({wheres = [], fields = []}) => {
        if (!Array.isArray(fields)) throw TypeError();

        let fieldstStr = fields.join(',') || '*';

        let searchStr = createSearchString(wheres);

        let sql = `select ${fieldstStr} from ${tableName} ${searchStr}`;
        let list: any = await mysql.query(sql);

        if (list.length > 1) {
            throw Error();
        } else if (list.length === 1) {
            return list[0];
        } else {
            return null;
        }
    }

    /**
     * 分页查询
     * @param wheres
     * @param fields
     * @param current
     * @param size
     * @returns {Promise<{current: number, total: *, size: number, records}>}
     */
    const getPage = async ({wheres = [], fields = [], current = 1, size = 10}) => {
        if (!Array.isArray(fields)) throw TypeError();

        let fieldsStr = fields.join(',') || '*';
        let searchStr = createSearchString(wheres);

        let sql = `select ${fieldsStr} from ${tableName} ${searchStr}`;
        const totalSql = `select count(*) as total from (${sql}) as tmp`;
        const pageSql = `${sql}  limit ${(current - 1) * size},${size}`

        const total: any = await mysql.query(totalSql);
        const list = await mysql.query(pageSql);

        return {
            current,
            size,
            total: total[0].total,
            records: list
        }
    }

    /**
     * 查询一次
     * @param wheres
     * @param selects
     * @param limit
     * @returns {Promise<void>}
     */
    const getList = async (rule?: { wheres: object[], selects?: any[], limit?: number }) => {
        let wheres = rule && rule.wheres || [];
        let selects = rule && rule.selects || [];
        let limit = rule && rule.limit;

        if (!Array.isArray(selects)) throw TypeError();

        let selectsStr = selects.join(',') || '*';
        let searchStr = createSearchString(wheres);

        let sql = `select ${selectsStr} from ${tableName} ${searchStr}`;
        if (typeof limit !== 'undefined') {
            sql += ` limit ${limit}`;
        }

        const list = await mysql.query(sql);

        return list;
    }

    /**
     * 更新
     * @param wheres
     * @param data
     * @returns {Promise<any>}
     */
    const update = async (rule: { wheres?: any[], set: Object }) => {
        let wheres = rule.wheres || [];
        let set: any = rule.set || {};

        if (!util.isPlainObject(set)) {
            throw TypeError();
        }

        let searchStr = createSearchString(wheres);

        let setStr = Object.keys(set).map(key => {
            return `${key}=${getCellSqlValue(key, set[key])}`;
        }).join(',');

        let sql = `update ${tableName} set ${setStr} ${searchStr}`;

        let list = await mysql.query(sql);
        return list;
    }

    /**
     * 更新
     * @param wheres
     * @returns {Promise<void>}
     */
    const del = async (rule: { wheres: any[] }) => {
        let wheres = rule.wheres || [];

        let searchStr = createSearchString(wheres);

        let sql = `delete from ${tableName} ${searchStr}`;
        if (!searchStr.trim()) {
            sql += ' 1=1';
        }

        const list = await mysql.query(sql);

        return list;
    }

    /**
     * 获取数量
     * @param wheres
     * @returns {Promise<number|*>}
     */
    const getCount = async (rule?: { wheres?: any[] }) => {
        let wheres = rule && rule.wheres || [];

        let searchStr = createSearchString(wheres);

        let sql = `select count(*) as num from ${tableName} ${searchStr}`;

        const rows: any = await mysql.query(sql);

        if (rows.length > 0) {
            return rows[0].num;
        }

        return 0;
    }

    return {
        insert,
        getOne,
        getPage,
        getList,
        update,
        del,
        getCount
    }
};

DaoGenerator.columnGType = columnGType;
DaoGenerator.searchGSign = searchGSign;
export = DaoGenerator;
