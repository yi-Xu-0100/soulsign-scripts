// ==UserScript==
// @name              威锋网
// @namespace         https://soulsign.inu1255.cn/scripts/235
// @version           1.0.3
// @author            yi-Xu-0100
// @loginURL          https://www.feng.com/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/威锋网
// @expire            21600000
// @domain            www.feng.com
// @domain            api.wfdata.club
// @grant            cookie
// @param            name 账户
// @param            pwd 密码
// ==/UserScript==

/**
 * @file 威锋网签到脚本
 * @author yi-Xu-0100
 * @version 1.0.3
 */

/**
 * @module 威锋网签到脚本
 * @description 脚本同时采用 cookie 方式和登录验证方式获取信息。cookie 的时效很短，在线检查频率为 6 小时，而如果提供账号密码，则会自动登录。
 * 
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 * 
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = [www.feng.com, api.wfdata.club]] - 请求的域名
 * @param {string|string[]} [grant = cookie] - 脚本需要的权限
 * @param {string} [expire = 21600000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/235] - 脚本主页
 * @param {string} [loginURL = https://www.feng.com/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/威锋网] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

const signHeader = {
    headers: {
        "Origin": "https://www.feng.com",
        "Referer": "https://www.feng.com/",
        "X-Request-Id":
            "qPGH1Pl6jyF+VvNdxEXgW6aHNVBxUVKXSc7hkhT2pscrDyUYqDl8pRBd3pjdWqOX"
    }
};

exports.run = async function (param) {
    var userinfo = await getCookie('https://www.feng.com/', 'userInfo');
    var signData = await axios.post('https://api.wfdata.club/v1/auth/signin',
        `account=${param.name}&password=${param.pwd}`,
        signHeader);
    if (userinfo == null && signData.data.status.message != "success") throw "未登录";
    var { data } = await axios.post('https://api.wfdata.club/v1/attendance/userSignIn',
        null,
        {
            headers: {
                "Origin": "https://www.feng.com",
                "Referer": "https://www.feng.com/",
                "X-Access-Token":
                    userinfo && JSON.parse(decodeURIComponent(userinfo)).accessToken
                    || signData.data.data.accessToken,
                "X-Request-Id":
                    "WDQKt2+dxMxPlIA4Wz5yf9l2x4N3rKqe65uuHK/Bejny5n6HnQFQ/1M4IAalbcTwRCmIXqT4sbZkc9yl1tAlfA=="
            }
        });
    if (data.status.message != "success") {
        if (/重复签到/.test(data.status.message)) return "重复签到";
        else throw data.status.message;
    } else {
        return `获得经验 ${data.data.getWeTicket} 点`
            + ((data.data.extraWeTicket != "0") ? `，额外经验 ${data.data.extraWeTicket} 点` : "");
    }
};

exports.check = async function (param) {
    var { data } = await axios.get('https://www.feng.com/login');
    if (!(/登录/.test(data))) return true;
    else {
        var testSign = await axios.post('https://api.wfdata.club/v1/auth/signin',
            `account=${param.name}&password=${param.pwd}`,
            signHeader);
        return (testSign.data.status.message === "success");
    };
};