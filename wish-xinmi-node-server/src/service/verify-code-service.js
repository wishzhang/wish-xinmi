const nodemailer = require("_nodemailer@6.6.0@nodemailer");
const validate = require('../util/validate');
const debug = require('debug')('xinmi-verifycode')

// 存储「邮箱-验证码」键值对
const cache = {};

/**
 * 发送邮箱验证码
 * @param emailAddress 对该邮箱发送验证码
 * @returns {Promise<void>}
 */
const sendEmailCode = async (emailAddress) => {
    let res = {};

    if (!validate.validEmailAddress(emailAddress)) {
        res = {code: 1, msg: '邮箱地址格式错误'};
        debug(`向${emailAddress}发送邮箱验证码失败：邮箱地址格式错误`);
    } else {
        try {
            let emailCode, transporter, timer;

            // 初始化发送器：基于QQ邮箱的SMTP协议、已有的固定邮箱账号密码来发送
            transporter = nodemailer.createTransport({
                service: 'QQ',
                auth: {user: 'wishzhang.io@qq.com', pass: 'extawcywnbpngadc'},
            });

            // 生成邮箱验证码
            emailCode = createEmailCode();

            // 进行发送邮箱
            await transporter.sendMail({
                from: `${global.config.projectCName}<wishzhang.io@qq.com>`,
                to: emailAddress,
                subject: `${global.config.projectCName}邮箱验证`,
                text: `尊敬的${global.config.projectCName}用户，您的验证码是：${emailCode}。`,
            });

            // 到这里验证码就发送成功了
            res = {code: 0, msg: '发送成功'};

            // 然后缓存并更新「邮箱-验证码」键值对
            cache[emailAddress] = emailCode;

            // 5分钟后验证码失效
            timer = setTimeout(() => {
                delete cache[emailAddress];
                clearInterval(timer);
            }, 5 * 60 * 1000);
        } catch (e) {
            res = {code: 2, msg: '邮箱验证码发送失败！'};
            debug(`向${emailAddress}发送邮箱验证码失败：%0`, e);
        }
    }

    return res;
}

const createEmailCode = () => {
    let emailCode = '';
    for (let i = 0; i < 6; i++) {
        emailCode += parseInt(Math.random() * 10)
    }
    return emailCode
}

/**
 * 验证邮箱和验证码是否匹配，即验证码是否发送到该邮箱
 * @param emailAddress
 * @param emailCode
 * @returns {*|boolean} 返回true表示匹配
 */
const canMatchEmailCode = (emailAddress, emailCode) => {
    return cache[emailAddress] && cache[emailAddress] === emailCode;
}

module.exports = {
    sendEmailCode,
    canMatchEmailCode,
    createEmailCode
}
