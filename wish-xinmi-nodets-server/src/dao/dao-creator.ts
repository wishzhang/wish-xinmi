/**
 * 思路：没有分词的步骤，直接定义ast树，根据ast树直接生成对应的代码,
 */
import util = require("../util");
import mysql = require("./mysql");
import construct = Reflect.construct;

export enum Ctype {
    string = 'string',
    number = 'number',
    uuid = 'uuid',
    datetime = 'datetime'
}

interface Ast {
    tableName: string;
    columns: Array<{ name: string; ctype: Ctype }>
}

const Op = {
    and: "and",
    or: "or",
    equal: "equal",
    like: "like",
    desc: "desc",
    asc: "asc"
};

export class DaoCreator {
    private tableName;
    private columns;
    private columnNames: Array<string>;
    private columnCtype: { [key: string]: Ctype } = {};

    constructor(ast: Ast) {
        this.tableName = ast.tableName;
        this.columns = ast.columns;

        this.columnNames = ast.columns.map(el => {
            return el.name;
        });

        ast.columns.forEach(el => {
            this.columnCtype[el.name] = el.ctype
        });
    }


    getCellValue(name: string, val: any) {
        let cellValue;
        const type = this.columnCtype[name];
        if (type === Ctype.number) {
            cellValue = val || 0;
        } else if (type === Ctype.string) {
            cellValue = typeof val === "undefined" ? 'null' : `'${val}'`;
        } else if (type === Ctype.uuid) {
            throw Error('不支持，主键不应该调用这个函数');
        } else if (type === Ctype.datetime) {
            cellValue = val || "now()";
        }
        return cellValue;
    };


    /**
     * 插入语句
     * @param data
     * @returns {Promise<any>}
     */
    async insertOne(data: any): Promise<string> {
        if (!util.isPlainObject(data)) {
            throw TypeError();
        }

        let uuid = '';
        let valueStr = '';
        let columnStr = '';

        valueStr = this.columnNames.map(name => {
            let cellValue = ''
            if (this.columnCtype[name] === Ctype.uuid) {
                uuid = util.uuid();
                cellValue = `'${uuid}'`;
            } else {
                cellValue = this.getCellValue(name, data[name]);
            }

            return cellValue;
        }).join(",");

        valueStr = `(${valueStr})`;

        columnStr = `(${this.columnNames.join(",")})`;

        await mysql.query(`insert into ${this.tableName} ${columnStr} values ${valueStr}`);

        return uuid;
    };
};
