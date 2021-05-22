export default function (namespace?: string) {
    let name = namespace ? `xinmi-${namespace}` : 'xinmi-default';
    return require("debug")(name);
};