// ==UserScript==
// @name              阿里云签到
// @namespace         https://soulsign.inu1255.cn?account=inu1255
// @version           1.0.2
// @author            inu1255
// @loginURL          https://account.aliyun.com/login/qr_login.htm?oauth_callback=https%3A%2F%2Fclub.aliyun.com%2F%23%2F
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/阿里云签到
// @expire            900000
// @domain            club.aliyun.com
// ==/UserScript==

/**
 * @file 阿里云签到脚本
 * @author inu1255
 * @version 1.0.2
 */

/**
 * @module 阿里云签到脚本
 * @description 本脚本是 [inu1255](https://github.com/inu1255) 所创造。
 * @param {string|string[]} [domain = club.aliyun.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/228] - 脚本主页
 * @param {string} [loginURL = https://account.aliyun.com/login/qr_login.htm?oauth_callback=https%3A%2F%2Fclub.aliyun.com%2F%23%2F] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/inu1255/阿里云签到] - 脚本更新链接
 */

const opts = { headers: { "referer": "https://club.aliyun.com/?spm=5176.12825654.amxosvpfn.27.45162c4a6Uuc9T" } };
exports.run = async function (param) {
    var { data } = await axios.get("https://club.aliyun.com/json/UserSignIn.json?signSource=pc&signCompany=aliyun", opts);
    await axios.get("https://club.aliyun.com/json/GetUserSignInfo.json?signSource=pc&signCompany=aliyun", opts)
    if (data.success) return `获得 ${data.data.todayPoints} 金币`;
    throw JSON.stringify(data);
};

exports.check = async function (param) {
    var { data } = await axios.get("https://club.aliyun.com/json/GetUserAllPoint.json", opts);
    return data.success;
};