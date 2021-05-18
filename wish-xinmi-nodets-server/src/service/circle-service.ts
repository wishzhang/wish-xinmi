import circleDao from "../dao/circle-dao";
import datetime from "../util/datetime";
import fileUtil from "../util/file-util";

const addThought = async (createUser: any, content: any, photoFiles: any = []) => {
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

const getPage = async (userId: any, current: any, size: any) => {
    const data: any = await circleDao.getCirclePage(userId, current, size);
    data.records.forEach((el: any) => {
        el.createTime = datetime.datePastLong(el.createTime);
    });
    return data;
};

const getUserThoughtPage = async (userId: string, current?: number, size?: number) => {
    const data = await circleDao.getUserThoughtPage(userId, current, size);
    return data;
};

export default {
    addThought,
    getPage,
    getUserThoughtPage
}