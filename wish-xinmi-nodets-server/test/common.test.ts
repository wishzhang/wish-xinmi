import {query} from "../src/dao/sequelize";
import testUtil from "./test-util";
const request = require("supertest");
import {QueryTypes} from '../src/dao/sequelize';
import verifyCodeService from "../src/service/verify-code-service";
import server from "../src/server";

// 注册两个用户
export async function registerTwoUser(): Promise<any> {
    let user1: any;
    let user2: any;
    let emailCode1: string;
    let emailCode2: string;
    let res1: any;
    let res2: any;

    emailCode1 = verifyCodeService.createEmailCode();
    await verifyCodeService.sendEmailCode(testUtil.account1.email, emailCode1, false);
    res1 = await request(server)
        .post("/login/loginByEmail")
        .send({
            emailAddress: testUtil.account1.email,
            verifyCode: emailCode1
        });
    user1 = res1.body.data;

    emailCode2 = verifyCodeService.createEmailCode();
    await verifyCodeService.sendEmailCode(testUtil.account2.email, emailCode2, false);
    res2 = await request(server)
        .post("/login/loginByEmail")
        .send({
            emailAddress: testUtil.account2.email,
            verifyCode: emailCode2
        });
    user2 = res2.body.data;

    expect(res1.body.code).toBe(0);
    expect(res1.body.data).not.toBeNull();
    expect(res2.body.code).toBe(0);
    expect(res2.body.data).not.toBeNull();
    expect(user1.username).not.toBe(user2.username);

    return {
        user1,
        user2
    }
}