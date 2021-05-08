// 加载环境配置
import config = require("./config/index");
import server =require("./server");

server.listen(config.serverPort, () => {
    console.log(`http://localhost:${config.serverPort}`);
    console.log(`http://${config.serverIp}:${config.serverPort}`);
});