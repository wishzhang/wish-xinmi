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
module.exports = {
    projectName: 'xinmi',
    // 服务器配置, 没有实际用到，只用来打印
    serverIp: ip,
    serverPort: 3000,
    // minio配置
    minioEndPoint: 'localhost',
    minioPort: 9000,
    minioHost: `http://localhost:9000`,
    minioAccessKey: 'minioadmin',
    minioSecretKey: 'minioadmin',
    minioUseSSL: false,
    minioBucketName: `xinmi-minio`
};