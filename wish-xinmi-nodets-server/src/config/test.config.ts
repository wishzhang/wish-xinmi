import baseConfig = require("./base.config");

const testConfig = Object.assign({}, baseConfig, {
    serverPort: 3001,
    mysql: {
        host: "localhost",
        user: "root",
        password: "123456",
        database: "xinmi_test"
    }
})

export = testConfig;