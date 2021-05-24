import {User} from "../dao/model";

async function login(username: string, password: string) {
    return await User.findOne({
        where: {
            username: username,
            password: password
        }
    })
};

export default {
    login
}