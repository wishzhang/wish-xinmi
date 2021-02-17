// 生产环境配置
const configProd = {
    serverPort: 3001
};

module.exports = require('./config.base')(configProd);