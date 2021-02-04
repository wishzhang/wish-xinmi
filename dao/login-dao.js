const mysql = require('./mysql');

const login = async ({username, password}) => {
  return await mysql.query(
    `select user.id, user.username from xinmi_user user 
    where username='${username}' and password='${password}'
    `
  );
};

module.exports = {
  login
}