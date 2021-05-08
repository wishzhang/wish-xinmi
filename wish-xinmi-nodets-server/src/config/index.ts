import devConfig = require("./dev.config");
import testConfig = require("./test.config");

let config:any;

if (process.env.NODE_ENV === "development") {
    config = devConfig;
} else if (process.env.NODE_ENV === "test") {
    config = testConfig;
}

export = config;
