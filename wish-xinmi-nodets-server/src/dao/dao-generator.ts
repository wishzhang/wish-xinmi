/**
 * 思路：没有分词的步骤，直接定义ast树，根据ast树直接生成对应的代码,
 */
import util = require("../util");
import mysql = require("./mysql");

const columnGType = {
    string: 1,
    number: 2,
    uuid: 3,
    datetime: 4
};

const fillSpace = (str: any) => {
    return ` ${str} `;
};

function getCellSqlValue(name: any, cellValue: any) {
    return typeof cellValue === "string" ? `'${cellValue}'` : cellValue;
}

const canInsertValueType = ["string", "number"];

const searchGSign = {
    and: "and",
    or: "or",
    equal: "equal",
    like: "like",
    desc: "desc",
    asc: "asc"
};

const createSearchString = (searchColumns: any) => {
    if (!Array.isArray(searchColumns)) throw TypeError();

    let searchStr = searchColumns.map(searchColumn => {
        const fieldStr = getSearchFieldStr(searchColumn);
        return fieldStr;
    }).join(" ");

    // 纠错
    searchStr = searchStr.trim();
    if (searchStr) {
        const arr = searchStr.split(/\s+/);
        const firstWord = arr.length > 0 ? arr[0] : "";
        if (firstWord.startsWith("order")) {

        } else {
            if (searchGSign.hasOwnProperty(firstWord)) {
                searchStr = searchStr.replace(firstWord, "");
            }
            searchStr = ` where ${searchStr}`;
        }
    }

    // 获取一个字段的sql搜索字符串
    function getSearchFieldStr(searchColumn: any) {
        const {name, value, signs = []} = searchColumn;

        let str = "";
        let tmp = "";

        for (const sign of signs) {
            tmp = "";
            // 有些未传参的字段，不需要去查。有些需要
            if (typeof value !== "undefined") {
                if (sign === "and") {
                    tmp = "and";
                } else if (sign === "or") {
                    tmp = "or";
                } else if (sign === "equal") {
                    const val = getCellSqlValue(name, value);
                    tmp = `${name}=${val}`;
                } else if (sign === "unequal") {
                    const val = getCellSqlValue(name, value);
                    tmp = `${name}!=${val}`;
                } else if (sign === "like") {
                    tmp = `${name} like '%${value}%'`;
                }
            }

            str += fillSpace(tmp);

            tmp = "";
            if (sign === "desc") {
                tmp = `order by ${name} desc`;
            } else if (sign === "asc") {
                tmp = `order by ${name} asc`;
            } else if (sign === "null") {
                tmp = `${name} is null`;
            }
            str += fillSpace(tmp);
        }

        return str;
    }

    return searchStr;
};

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
    };

    const getCellValue = (name: string, val: any) => {
        let cellValue;
        const type = getcolumnGType(name);
        if (type === columnGType.number) {
            cellValue = val || 0;
        } else if (type === columnGType.string) {
            cellValue = typeof val === "undefined" ? 'null' : `'${val}'`;
        } else if (type === columnGType.uuid) {
            throw Error('不支持，主键不应该调用这个函数');
        } else if (type === columnGType.datetime) {
            cellValue = val || "now()";
        }
        return cellValue;
    };

    /**
     * 插入语句
     * @param data
     * @returns {Promise<any>}
     */
    const insertOne = async (data: any): Promise<string> => {
        if (!util.isPlainObject(data)) {
            throw TypeError();
        }

        let uuid = '';
        let valueStr = '';
        let columnStr = '';

        valueStr = columnNames.map(name => {
            let cellValue = ''
            if (getcolumnGType(name) === columnGType.uuid) {
                uuid = util.uuid();
                cellValue = `'${uuid}'`;
            } else {
                cellValue = getCellValue(name, data[name]);
            }

            return cellValue;
        }).join(",");
        valueStr = `(${valueStr})`;

        columnStr = `(${columnNames.join(",")})`;

        await mysql.query(`insert into ${tableName} ${columnStr} values ${valueStr}`);

        return uuid;
    };

    const insertBatch = async (arr: any) => {
        if (!Array.isArray(arr)) {
            const ps = arr.map((el: any) => {
                return function () {
                    return insertOne(el);
                }
            })

            return await mysql.transaction([...ps]);
        }
        return [];
    }

    /**
     * 查询一个语句
     * @param searchColumns
     */
    const getOne = async ({wheres = [], fields = []}) => {
        if (!Array.isArray(fields)) throw TypeError();

        const fieldstStr = fields.join(",") || "*";

        const searchStr = createSearchString(wheres);

        const sql = `select ${fieldstStr} from ${tableName} ${searchStr}`;
        const list: any = await mysql.query(sql);

        if (list.length > 1) {
            throw Error();
        } else if (list.length === 1) {
            return list[0];
        } else {
            return null;
        }
    };

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

        const fieldsStr = fields.join(",") || "*";
        const searchStr = createSearchString(wheres);

        const sql = `select ${fieldsStr} from ${tableName} ${searchStr}`;
        const totalSql = `select count(*) as total from (${sql}) as tmp`;
        const pageSql = `${sql}  limit ${(current - 1) * size},${size}`;

        const total: any = await mysql.query(totalSql);
        const list = await mysql.query(pageSql);

        return {
            current,
            size,
            total: total[0].total,
            records: list
        };
    };

    /**
     * 查询一次
     * @param wheres
     * @param selects
     * @param limit
     * @returns {Promise<void>}
     */
    const getList = async (rule?: { wheres: any[], selects?: any[], limit?: number }) => {
        const wheres = rule && rule.wheres || [];
        const selects = rule && rule.selects || [];
        const limit = rule && rule.limit;

        if (!Array.isArray(selects)) throw TypeError();

        const selectsStr = selects.join(",") || "*";
        const searchStr = createSearchString(wheres);

        let sql = `select ${selectsStr} from ${tableName} ${searchStr}`;
        if (typeof limit !== "undefined") {
            sql += ` limit ${limit}`;
        }

        const list = await mysql.query(sql);

        return list;
    };

    /**
     * 更新
     * @param wheres
     * @param data
     * @returns {Promise<any>}
     */
    const update = async (rule: { wheres?: any[], set: any }) => {
        const wheres = rule.wheres || [];
        const set: any = rule.set || {};

        if (!util.isPlainObject(set)) {
            throw TypeError();
        }

        const searchStr = createSearchString(wheres);
        let setStr: string = '';
        let setArr: string[] = [];

        Object.keys(set).forEach(key => {
            if (typeof set[key] !== 'undefined') {
                setArr.push(`${key}=${getCellSqlValue(key, set[key])}`);
            }
        });

        setStr = setArr.join(',');

        const sql = `update ${tableName} set ${setStr} ${searchStr}`;

        const list = await mysql.query(sql);
        return list;
    };

    /**
     * 更新
     * @param wheres
     * @returns {Promise<void>}
     */
    const del = async (rule: { wheres: any[] }) => {
        const wheres = rule.wheres || [];

        const searchStr = createSearchString(wheres);

        let sql = `delete from ${tableName} ${searchStr}`;

        if (!searchStr.trim()) {
            sql += "where 1=1";
        }

        const list = await mysql.query(sql);

        return list;
    };

    /**
     * 获取数量
     * @param wheres
     * @returns {Promise<number|*>}
     */
    const getCount = async (rule?: { wheres?: any[] }) => {
        const wheres = rule && rule.wheres || [];

        const searchStr = createSearchString(wheres);

        const sql = `select count(*) as num from ${tableName} ${searchStr}`;

        const rows: any = await mysql.query(sql);

        if (rows.length > 0) {
            return rows[0].num;
        }

        return 0;
    };

    return {
        insertOne,
        getOne,
        getPage,
        getList,
        update,
        del,
        getCount,
        insertBatch
    };
};

DaoGenerator.columnGType = columnGType;
DaoGenerator.searchGSign = searchGSign;
export = DaoGenerator;
