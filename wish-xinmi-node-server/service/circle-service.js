const circleDao = require('../dao/circle-dao');
const datetime = require('../util/datetime');
const fileUtil = require('../util/file-util');

const addThought = async ({createUser, content, photoFiles = []}) => {
    const ps = photoFiles.map(photoFile => {
        return fileUtil.putFile(photoFile);
    });

    const resArr = await Promise.all(ps);
    const links = resArr.map(res => {
        return res.link;
    });
    const photosUrl = links.join(',');

    return await circleDao.addThought({createUser, content, photosUrl});
}

const getPage = async ({userId, current, size}) => {
    const data = await circleDao.getCirclePage({userId, current, size});
    data.records.forEach(el => {
        el.createTime = datetime.datePastLong(el.createTime);
    });
    return data;
}

const getUserThoughtPage = async ({userId, current, size}) => {
    const data = await circleDao.getUserThoughtPage({userId, current, size});
    return data;
}

module.exports = {
    addThought,
    getPage,
    getUserThoughtPage
}