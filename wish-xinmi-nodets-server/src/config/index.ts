import devConfig from "./dev.config";
import testConfig from "./test.config";

let config: any;

if (process.env.NODE_ENV === "development") {
    config = devConfig;
} else if (process.env.NODE_ENV === "test") {
    config = testConfig;
}

export default config;
