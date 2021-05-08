import baseConfig = require("./base.config");

const testConfig = Object.assign({}, baseConfig, {
    serverPort: 3001
})

export = testConfig;