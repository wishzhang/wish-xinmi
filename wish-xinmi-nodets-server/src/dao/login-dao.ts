import {query} from "./sequelize";

async function login(username: string, password: string) {
    return await query(
        `select user.id, user.username from xinmi_user user 
    where username='${username}' and password='${password}'
    `
    );
};

export default {
    login
}