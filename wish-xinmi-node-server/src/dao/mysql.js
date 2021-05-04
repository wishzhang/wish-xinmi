const debug = require('debug')('xinmi-dao');
const util = require('../util');
const mysql = require('_mysql@2.18.1@mysql');
const executor = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'xinmi'
    });
    return new Promise((resolve, reject) => {
        connection.connect();
        return resolve(connection);
    })
};

const travelOne = (i, arr, conn, resArr = [], resolve, reject) => {
    if (i < arr.length) {
        const p = arr[i];
        p(conn, resArr).then(res => {
            travelOne(i + 1, arr, conn, [...resArr, res], resolve, reject);
        }).catch(err => {
            conn.rollback(function () {
                transactionFail(reject(err))
            });
        })
    } else {
        conn.commit(function (err) {
            if (err) {
                return conn.rollback(function () {
                    transactionFail(reject(err))
                });
            } else {
                resolve(resArr);
                debug('-----------------------执行MySQL事务成功----------------------------');
            }
        });
    }
};

const output = {
    begin(out = '') {
        debug('-----------------------------SQL开始-----------------------------');
        debug(out);
    },
    end(out = '') {
        debug('SQL执行结果:');
        debug(out);
        debug('-----------------------------SQL结束-----------------------------');
    }
}

const transactionFail = () => {
    debug('-----------------------执行MySQL事务失败----------------------------');
}

const genTQuery = (func) => {
    return async (conn, res) => {
        return new Promise((resolve, reject) => {
            const r = func(res);
            if (util.isPromise(r)) {
                r.then(rows => {
                    resolve(rows);
                    output.end(rows);
                }).catch(err => {
                    transactionFail(reject(err))
                    output.end(err);
                })
            } else {
                let sql = r;
                output.begin(sql);
                conn.query(sql, function (err, rows, fields) {
                    if (err) {
                        transactionFail(reject(err))
                        output.end(err);
                        return;
                    }
                    resolve(rows);
                    output.end(rows);
                });
            }
        })
    }
};

const query = async (sql) => {
    const conn = await executor();
    return new Promise((resolve, reject) => {
        output.begin(sql);
        conn.query(sql, function (err, rows, fields) {
            if (err) {
                transactionFail(reject(err))
                output.end(err);
                return;
            }
            let list = Array.isArray(rows) ? util.toHumpList(rows) : rows;
            resolve(list);
            output.end(list);
        })
    }).finally(() => {
        conn.end();
    })
};

module.exports = {
    // 分页查询
    async queryPage(sql, current, size) {
        const totalSql = `select count(*) as total from (${sql}) as tmp`;
        const pageSql = `${sql} ${L.page({current, size})}`

        const total = await query(totalSql);
        const list = await query(pageSql);

        return {
            current,
            size,
            total: total[0].total,
            records: list
        }
    },
    query,
    // 执行
    async transaction(rawArr = []) {
        debug('-----------------------执行MySQL事务开始----------------------------');
        const queryArr = rawArr.map(el => genTQuery(el));
        const conn = await executor();
        return new Promise(async (resolve, reject) => {
            conn.beginTransaction(function (err) {
                if (err) {
                    return transactionFail(reject(err))
                }
                travelOne(0, queryArr, conn, [], resolve, reject);
            })
        }).finally(() => {
            conn.end();
            debug('-----------------------执行MySQL事务结束----------------------------');
        })
    }
}