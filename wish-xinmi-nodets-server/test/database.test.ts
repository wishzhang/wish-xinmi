import {setupModel} from "../src/dao/model";
import {query} from "../src/dao/sequelize";

test("测试数据库初始化", async (done) => {
    await setupModel();

    const rows = await query(`select * from xinmi_user`);

    expect(rows).not.toBeNull();
    done();
});