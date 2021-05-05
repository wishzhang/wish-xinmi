import util = require("../util");

const convert:any = {
    "avatarUrl": function (oval: any) {
        return util.getMinioUrl(oval);
    },
    "photosUrl": function (oval:any) {
        if (!oval) return oval;
        return oval.split(",").map((el:any) => util.getMinioUrl(el)).join(",");
    }
};

function _field(obj:any, key:any) {
    if (convert.hasOwnProperty(key) && typeof obj[key] === "string") {
        obj[key] = convert[key](obj[key]);
    } else {
        convertFields(obj[key]);
    }
}

function convertFields(arr:any) {
    if (Array.isArray(arr)) {
        arr.forEach(obj => {
            Object.keys(obj).forEach(key => {
                _field(obj, key);
            });
        });
    } else if (arr && typeof arr === "object") {
        const obj = arr;
        Object.keys(obj).forEach(key => {
            _field(obj, key);
        });
    }
}

export = () => {
    return (async (ctx:any, next:any) => {
        if (ctx.body && ctx.body.data) {
            const data = ctx.body.data;
            convertFields(data);
            ctx.body.data = data;
        }
        next();
    });
}