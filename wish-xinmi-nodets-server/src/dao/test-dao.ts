// 用于测试的一些数据库操作。先在数据库中插入相应的数据，然后拿到这里来选择部分执行。
// 执行前和执行后进行清理工作。
// import mysql = require("./mysql");
//
// const
//
// const login = async (username:string, password:string) => {
//     return await mysql.query(
//         `select user.id, user.username from xinmi_user user
//     where username='${username}' and password='${password}'
//     `
//     );
// };
//
// export = {
//     login
// }