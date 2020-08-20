// ==UserScript==
// @name              威锋网
// @namespace         https://soulsign.inu1255.cn/scripts/235
// @version           1.0.2
// @author            yi-Xu-0100
// @loginURL          https://www.feng.com/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/威锋网
// @expire            21600000
// @domain            www.feng.com
// @domain            api.wfdata.club
// @grant            cookie
// ==/UserScript==

/**
 * @file 威锋网签到脚本
 * @author yi-Xu-0100
 * @version 1.0.2
 */

/**
 * @module 威锋网签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 * 
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = [www.feng.com, api.wfdata.club]] - 请求的域名
 * @param {string|string[]} [grant = cookie] - 脚本需要的权限
 * @param {string} [expire = 21600000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/235] - 脚本主页
 * @param {string} [loginURL = https://www.feng.com/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/威锋网] - 脚本更新链接
 */

exports.run = async function (param) {
    var userinfo = await getCookie('https://www.feng.com/', 'userInfo');
    if (userinfo === null) throw "请登录";
    var { data } = await axios.post('https://api.wfdata.club/v1/attendance/userSignIn',
        null,
        {
            headers: {
                "Origin": "https://www.feng.com",
                "Referer": "https://www.feng.com/",
                "X-Access-Token": JSON.parse(decodeURIComponent(userinfo)).accessToken,
                "X-Request-Id":
                    "WDQKt2+dxMxPlIA4Wz5yf9l2x4N3rKqe65uuHK/Bejny5n6HnQFQ/1M4IAalbcTwRCmIXqT4sbZkc9yl1tAlfA=="
            }
        });
    if (data.status.message != "success") {
        return data.status.message;
    } else {
        return `获得经验${data.data.getWeTicket}点` +
            ((data.data.extraWeTicket != "0") ? `，额外经验 ${data.data.extraWeTicket} 点` : "");
    }
};

exports.check = async function (param) {
    var { data } = await axios.get('https://www.feng.com/login');
    return !(/登录/.test(data));
};