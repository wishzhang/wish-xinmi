import mysql = require('./mysql');

const login = async (username:string, password:string) => {
  return await mysql.query(
    `select user.id, user.username from xinmi_user user 
    where username='${username}' and password='${password}'
    `
  );
};

export = {
  login
}