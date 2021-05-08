import baseConfig = require("./base.config");

const devConfig = Object.assign({}, baseConfig, {
    serverPort: 3000
});

export = devConfig