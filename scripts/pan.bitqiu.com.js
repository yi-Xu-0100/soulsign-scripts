// ==UserScript==
// @name              比特球云盘
// @namespace         https://soulsign.inu1255.cn/scripts/251
// @version           1.0.0
// @author            yi-Xu-0100
// @loginURL          https://pan.bitqiu.com/
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/比特球云盘
// @expire            900000
// @domain            pan.bitqiu.com
// ==/UserScript==

/**
 * @file 比特球云盘签到脚本
 * @author yi-Xu-0100
 * @version 1.0.0
 */

/**
 * @module 比特球云盘签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 * 
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = pan.bitqiu.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/251] - 脚本主页
 * @param {string} [loginURL = https://pan.bitqiu.com/] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/比特球云盘] - 脚本更新链接
 */

exports.run = async function (param) {
    let resp = await axios.post("https://pan.bitqiu.com/integral/randomSignin");
    if (resp.data.message == "用户session已过期") throw "需要登录";
    if (resp.data.message == "已签到") return "重复签到";
    if (resp.data.message == "成功") return `获得 ${resp.data.data.integral} 积分`;
    throw resp.data;

};

exports.check = async function (param) {
    let resp = await axios.post("https://pan.bitqiu.com/integral/getUserIntegral");
    return (resp.data.message != "用户session已过期");
};
