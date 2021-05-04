const util = require('../util');

const convert = {
    'avatarUrl': function (oval) {
        return util.getMinioUrl(oval);
    },
    'photosUrl': function (oval) {
        if (!oval) return oval;
        return oval.split(',').map(el => util.getMinioUrl(el)).join(',');
    }
}

function _field(obj, key) {
    if (convert.hasOwnProperty(key) && typeof obj[key] === 'string') {
        obj[key] = convert[key](obj[key]);
    } else {
        convertFields(obj[key]);
    }
}

function convertFields(arr) {
    if (Array.isArray(arr)) {
        arr.forEach(obj => {
            Object.keys(obj).forEach(key => {
                _field(obj, key);
            })
        })
    } else if (arr && typeof arr === 'object') {
        const obj = arr;
        Object.keys(obj).forEach(key => {
            _field(obj, key);
        })
    }
}

module.exports = () => {
    return (async (ctx, next) => {
        if (ctx.body && ctx.body.data) {
            const data = ctx.body.data;
            convertFields(data);
            ctx.body.data = data;
        }
        next();
    });
}