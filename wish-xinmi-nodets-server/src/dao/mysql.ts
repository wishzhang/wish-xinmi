const debug = require("debug")("xinmi-dao");
import util = require("../util");
const mysql = require("mysql");

const executor = () => {
    const connection = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "123456",
        database: "xinmi"
    });
    return new Promise((resolve, reject) => {
        connection.connect();
        return resolve(connection);
    });
};

const travelOne = (i: any, arr: any, conn: any, resArr: any, resolve: any, reject: any) => {
    if (i < arr.length) {
        const p = arr[i];
        p(conn, resArr).then((res: any) => {
            travelOne(i + 1, arr, conn, [...resArr, res], resolve, reject);
        }).catch((err: any) => {
            conn.rollback(function () {
                transactionFail(reject(err));
            });
        });
    } else {
        conn.commit(function (err: any) {
            if (err) {
                return conn.rollback(function () {
                    transactionFail(reject(err));
                });
            } else {
                resolve(resArr);
                debug("-----------------------执行MySQL事务成功----------------------------");
            }
        });
    }
};

const output = {
    begin(out = "") {
        debug("-----------------------------SQL开始-----------------------------");
        debug(out);
    },
    end(out = "") {
        debug("SQL执行结果:");
        debug(out);
        debug("-----------------------------SQL结束-----------------------------");
    }
};

const transactionFail = (obj: any) => {
    debug("-----------------------执行MySQL事务失败----------------------------");
};

const genTQuery = (func: any) => {
    return async (conn: any, res: any) => {
        return new Promise((resolve, reject) => {
            const r = func(res);
            if (util.isPromise(r)) {
                r.then((rows: any) => {
                    resolve(rows);
                    output.end(rows);
                }).catch((err: any) => {
                    transactionFail(reject(err));
                    output.end(err);
                });
            } else {
                const sql = r;
                output.begin(sql);
                conn.query(sql, function (err: any, rows: any, fields: any) {
                    if (err) {
                        transactionFail(reject(err));
                        output.end(err);
                        return;
                    }
                    resolve(rows);
                    output.end(rows);
                });
            }
        });
    };
};

const query = async (sql: any) => {
    const conn: any = await executor();
    return new Promise((resolve, reject) => {
        output.begin(sql);
        conn.query(sql, function (err: any, rows: any, fields: any) {
            if (err) {
                transactionFail(reject(err));
                output.end(err);
                return;
            }
            const list = Array.isArray(rows) ? util.toHumpList(rows) : rows;
            resolve(list);
            output.end(list);
        });
    }).finally(() => {
        conn.end();
    });
};

export = {
    query,
    // 执行
    async transaction(rawArr: any = []) {
        debug("-----------------------执行MySQL事务开始----------------------------");
        const queryArr = rawArr.map((el: any) => genTQuery(el));
        const conn: any = await executor();
        return new Promise(async (resolve, reject) => {
            conn.beginTransaction(function (err: any) {
                if (err) {
                    return transactionFail(reject(err));
                }
                travelOne(0, queryArr, conn, [], resolve, reject);
            });
        }).finally(() => {
            conn.end();
            debug("-----------------------执行MySQL事务结束----------------------------");
        });
    }
}