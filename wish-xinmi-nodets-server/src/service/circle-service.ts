import circleDao from "../dao/circle-dao";
import datetime from "../util/datetime";
import fileUtil from "../util/file-util";

async function addThought(createUser: string, content: string, photoFiles: Array<string> = []) {
    const ps = photoFiles.map((photoFile: any) => {
        return fileUtil.putFile(photoFile);
    });

    const resArr = await Promise.all(ps);
    const links = resArr.map((res: any) => {
        return res.link;
    });
    const photosUrl = links.join(",");

    return await circleDao.addThought(createUser, content, photosUrl);
};

async function getPage(userId: string, current?: number, size?: number) {
    const data: any = await circleDao.getCirclePage(userId, current, size);
    data.records.forEach((el: any) => {
        el.createdAt = datetime.datePastLong(el.createdAt);
    });
    return data;
};

async function getUserThoughtPage(userId: string, current?: number, size?: number) {
    const data = await circleDao.getUserThoughtPage(userId, current, size);
    return data;
};

export default {
    addThought,
    getPage,
    getUserThoughtPage
}