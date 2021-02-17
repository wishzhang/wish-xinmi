const Minio = require('minio');
const util = require('./index');
const bucketName = 'xinmi';
var fs = require('fs');
const ip = require('./index').getIPAddress();
const port = 9000;

const minioClient = new Minio.Client({
    endPoint: ip,
    port: port,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
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
        link: `http://${ip}:${port}/${bucketName}/${newName}`
    }
}

module.exports = {
    putFile
}