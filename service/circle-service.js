const circleDao = require('../dao/circle-dao');
const datetime = require('../util/datetime');
const fileUtil = require('../util/file-util');

const addThought = async ({createUser, content, photoFiles = []}) => {
    const ps = photoFiles.map(photoFile => {
        return fileUtil.putFile(photoFile);
    });

    const resArr = await Promise.all(ps);
    const links = resArr.map(res=>{
        return res.path;
    });
    const photosUrl = links.join(',');

    return await circleDao.addThought({createUser, content, photosUrl});
}

const getPeopleList = async ({userId}) => {
    const list = await circleDao.getPeopleList({userId});
    return list;
}

const getMineAllList = async ({userId}) => {
    const list = await circleDao.getMineAllList({userId});
    list.forEach(el => {
        el.createTime = datetime.datePastLong(el.createTime);
    });
    return list;
}

module.exports = {
    addThought,
    getPeopleList,
    getMineAllList,
}