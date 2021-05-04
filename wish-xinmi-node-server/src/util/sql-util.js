function Operation() {
    this.str = '';
}

Operation.prototype.pair = function (obj) {
    // this.str += Object.entries(obj).map(el => {
    //     if (el[1] === undefined || el[1]) {
    //         el[1] = '';
    //     }
    //     return el.join('=');
    // }).join(',');
    //
    // return this;
}

Operation.prototype.and = function (obj) {
    this.str += Object.entries(obj).map(el => {
        return ' and ' + el.join('=');
    });
    return this;
}

Operation.prototype.or = function (obj) {
    this.str += Object.entries(obj).map(el => {
        return ' or ' + el.join('=');
    });
    return this;
}

Operation.prototype.page = function ({current, size}) {
    this.str += ` limit ${(current - 1) * size},${size}`
    return this;
}

Operation.prototype.defaultCurrent = 1;
Operation.prototype.defaultSize = 10;

Operation.prototype.toString = function () {
    return this.str;
}

module.exports = Operation;