export = function (namespace: string) {
    return require("debug")(`xinmi-${namespace}`);
};