const nodemailer = require("nodemailer");

const codeCache = {};

const checkCode = (emailAddress, code) => {
    return codeCache[emailAddress] && codeCache[emailAddress] === code;
}

const sendEmail = async (targetAddr) => {
    let res = {};
    if (!validAddr(targetAddr)) {
        res = {code: 1, msg: '邮箱地址错误'};
    }

    try {
        let transporter = nodemailer.createTransport({
            service: 'QQ',
            auth: {
                user: 'wishzhang.io@qq.com',
                pass: 'extawcywnbpngadc',
            },
        });

        const code = genCode();

        let info = await transporter.sendMail({
            from: `${global.config.projectCName}<wishzhang.io@qq.com>`,
            to: targetAddr,
            subject: `${global.config.projectCName}邮箱验证`,
            text: `尊敬的${global.config.projectCName}用户，您的验证码是：${code}。`,
        });

        codeCache[targetAddr] = code;

        setTimeout(() => {
            delete codeCache[targetAddr];
        }, 5 * 60 * 1000);

        res = {code: 0, msg: '发送成功'};
    } catch (e) {
        throw Error(e.message);
    }

    return res;
}

const validAddr = (addr) => {
    const regEmail = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/; //验证邮箱正则
    return regEmail.test(addr);
}

const genCode = () => {
    let code = ""
    for (let i = 0; i < 6; i++) {
        code += parseInt(Math.random() * 10)
    }
    return code
}

module.exports = {
    sendEmail,
    checkCode
}
