const mysql = require('./mysql');
const util = require('../util/index');
const uuid = util.uuid;

/*查询我发的和我朋友发的所有朋友圈*/
const getMineAllList = async ({userId}) => {
  const list = await mysql.query(`
    SELECT
      DISTINCT xt.thought_id,
      xt.content,
      xt.create_time,
      xt.create_user,
      xu.username,
      xc.contact_name
    FROM
      xinmi_thought xt
      INNER JOIN xinmi_user xu ON xt.create_user = xu.id
      INNER JOIN xinmi_contact xc ON xt.create_user = xc.contact_id 
    WHERE
      xt.create_user IN ( SELECT contact_id FROM xinmi_contact WHERE user_id = '${userId}' ) 
      OR xt.create_user = '${userId}' order by xt.create_time desc
      `)
  return list;
}

// 查询我发的朋友圈
const getPeopleList = async ({userId}) => {
  const list = await mysql.query(`
    SELECT
    DISTINCT xt.thought_id, xt.content, xt.create_user, xt.create_time, xu.username, xc.contact_name
    FROM
      xinmi_thought xt
      INNER JOIN xinmi_user xu ON xt.create_user = xu.id
      INNER JOIN xinmi_contact xc ON xt.create_user = xc.contact_id 
    WHERE
      xt.create_user = '${userId}';
    `)
  return list;
}

// 添加一条朋友圈
const addThought = async ({createUser, content}) => {
  await mysql.query(`
    INSERT INTO xinmi_thought ( thought_id, content, create_time, create_user )
    VALUES
      ( UUID( ), '${content}', NOW( ), '${createUser}' );
    `)
}

module.exports = {
  addThought,
  getPeopleList,
  getMineAllList,
}

