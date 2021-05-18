export default function (namespace: string) {
    return require("debug")(`xinmi-${namespace}`);
};