const Minio = require("minio");
import util = require("./index");
import config = require("../config");

const fs = require("fs");
const bucketName = config.minioBucketName;

const minioClient = new Minio.Client({
    endPoint: config.minioEndPoint,
    port: config.minioPort,
    useSSL: config.minioUseSSL,
    accessKey: config.minioAccessKey,
    secretKey: config.minioSecretKey
});

const putFile = async (file: any) => {
    const newName = util.uuid() + util.getSuffix(file.name);

    const isExist = await minioClient.bucketExists(bucketName);
    if (!isExist) {
        await minioClient.makeBucket(bucketName);
        console.log("Bucket created successfully.");
    }

    const rs = fs.createReadStream(file.path);
    await minioClient.putObject(bucketName, newName, rs);

    return {
        originName: file.name,
        filename: newName,
        link: newName
    };
};

export = {
    putFile
}