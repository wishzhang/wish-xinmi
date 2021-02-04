const pinyin = require('pinyin');
console.log('..........');
const arr = [
  'abc',
  '啊已',
  '1334',
  '1234',
  '8Aae',
  '9234',
  'Cwqe'
];

let list = [];

list = arr.map(el => {
  const arr = pinyin(el.cat, {
    style: pinyin.STYLE_FIRST_LETTER, // 设置拼音风格
  });
  const str = arr[0][0];
  return str.substr(0, 1).toUpperCase();
})

console.log(list);
