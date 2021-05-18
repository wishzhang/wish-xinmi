// 加载环境配置
import config from "./config/index";
import server from "./server";

server.listen(config.serverPort, () => {
    console.log(`http://localhost:${config.serverPort}`);
    console.log(`http://${config.serverIp}:${config.serverPort}`);
});