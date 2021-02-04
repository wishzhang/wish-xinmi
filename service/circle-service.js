const circleDao = require('../dao/circle-dao');
const datetime = require('../util/datetime');

const addThought = async ({createUser, content}) => {
  return await circleDao.addThought({createUser, content});
}

const getPeopleList = async ({userId}) => {
  return await circleDao.getPeopleList({userId});
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