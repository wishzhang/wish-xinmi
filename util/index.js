const {v4: uuidv4} = require('uuid');
const pinyin = require('pinyin');

const generateRouteKey = (namespace) => {
  return (name) => {
    return namespace + name;
  }
};

const uuid = () => {
  return uuidv4();
}

const successRes = ({code = 0, msg = '成功', data = {}}) => {
  const obj = {
    code: code,
    msg: msg,
    data: data
  };
  return obj;
}

const getFirstUpperLetter = (str) => {
  const arr = pinyin(str, {
    style: pinyin.STYLE_FIRST_LETTER,
  });
  const pureOnePinyin = arr[0][0];
  const letter = pureOnePinyin.substr(0, 1).toUpperCase();
  return letter;
}

const _toHump = (name) => {
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}

const toHumpList = (list = []) => {
  return list.map(el => {
    Object.keys(el).forEach(key => {
      const humpKey = _toHump(key);
      if (humpKey !== key) {
        el[humpKey] = el[key];
        delete el[key];
      }
    })
    return el;
  })
}

module.exports = {
  generateRouteKey,
  uuid,
  successRes,
  getFirstUpperLetter,
  toHumpList
}