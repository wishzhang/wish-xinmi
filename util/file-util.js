const Minio = require('minio');
const util = require('./index');
const fs = require('fs');
const bucketName = global.config.minioBucketName;

const minioClient = new Minio.Client({
    endPoint: global.config.minioEndPoint,
    port: global.config.minioPort,
    useSSL: global.config.minioUseSSL,
    accessKey: global.config.minioAccessKey,
    secretKey: global.config.minioSecretKey
});

const putFile = async (file) => {
    const newName = util.uuid() + util.getSuffix(file.name);

    const isExist = await minioClient.bucketExists(bucketName);
    if (!isExist) {
        await minioClient.makeBucket(bucketName);
        console.log('Bucket created successfully.')
    }

    const rs = fs.createReadStream(file.path);
    await minioClient.putObject(bucketName, newName, rs);

    return {
        originName: file.name,
        filename: newName,
        link: newName
    }
}

module.exports = {
    putFile
}