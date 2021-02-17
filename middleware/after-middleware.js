const util = require('../util/index');

const fields = ['avatarUrl'];

const convertValue = (val) => {
    return util.getMinioUrl(val);
}

function fillFields(arr) {
    if (Array.isArray(arr)) {
        arr.forEach(obj => {
            Object.keys(obj).forEach(key => {
                if (fields.includes(key) && typeof obj[key] === 'string') {
                    obj[key] = convertValue(obj[key]);
                } else {
                    fillFields(obj[key]);
                }
            })
        })
    } else if (arr && typeof arr === 'object') {
        const obj = arr;
        Object.keys(obj).forEach(key => {
            if (fields.includes(key) && typeof obj[key] === 'string') {
                obj[key] = convertValue(obj[key]);
            } else {
                fillFields(obj[key]);
            }
        })
    }
}

module.exports = () => {
    return (async (ctx, next) => {
        const data = ctx.body.data;
        fillFields(data);
        ctx.body.data = data;
        next();
    });
}