const ip = (function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (let [networkType, networks] of Object.entries(interfaces)) {
        if (networkType.startsWith('VM')) continue;

        for (let network of networks) {
            if (network.family === 'IPv4'
                && network.address !== '127.0.0.1'
                && !network.internal) {
                return network.address;
            }
        }
    }
})();

// 公共环境配置
const configBase = {
    // 服务器配置
    serverIp: ip,

    // minio配置
    minioEndPoint: ip,
    minioPort: 9000,
    minioHost: `http://${ip}:9000`,
    minioAccessKey: 'minioadmin',
    minioSecretKey: 'minioadmin',
    minioUseSSL: false,
    minioBucketName: 'xinmi'
};

module.exports = function (config) {
    return Object.assign({}, configBase, config);
};