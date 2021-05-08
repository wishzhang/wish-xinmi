import verifyCodeService = require("../src/service/verify-code-service");
import server = require("../src/server");
import request = require("supertest");
import testUtil = require("./test-util");
import mysql = require("../src/dao/mysql");

let user1: any;
let user2: any;

beforeAll(async (done) => {
    const res = await testUtil.prepareTest();
    user1 = res.user1;
    user2 = res.user2;

    const res1 = await request(server)
        .get("/contact/addContact")
        .query({
            id: user1.id,
            contactId: user2.id,
            validateMsg: 'who am i'
        });
    expect(res1.body.code).toBe(0);

    const res2 = await request(server)
        .get("/contact/confirmContact")
        .query({
            id: user2.id,
            contactId: user1.id
        });
    expect(res2.body.code).toBe(0);

    done();
})

afterAll(async () => {
    await testUtil.afterTest();
})

describe("朋友圈", () => {
    describe('获取我的公共朋友圈', () => {
        test("/circle/getPage", async (done) => {
            const res = await request(server)
                .get("/circle/getPage")
                .query({
                    userId: user1.id,
                    current: 1,
                    size: 10
                })
            expect(res.body.code).toBe(0);
            done();
        });
    })

    describe('获取某人的朋友圈', () => {
        test("/circle/getUserThoughtPage", async (done) => {
            const res = await request(server)
                .get("/circle/getUserThoughtPage")
                .query({
                    userId: user1.id
                })
            expect(res.body.code).toBe(0);
            done();
        });
    })

    describe('发一条朋友圈', () => {
        test("/circle/addThought", async (done) => {
            const res = await request(server)
                .post("/message/addMessage")
                .send({
                    originUser: user1.id,
                    targetUser: user2.id,
                    content: '圈圈内容' + Date.now()
                })
            expect(res.body.code).toBe(0);
            done();
        });
    })
});

