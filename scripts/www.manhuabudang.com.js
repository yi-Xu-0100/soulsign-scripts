// ==UserScript==
// @name              漫画补档
// @namespace         https://soulsign.inu1255.cn/scripts/266
// @version           1.0.2
// @author            yi-Xu-0100
// @loginURL          https://www.manhuabudang.com/login.php
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/漫画补档
// @expire            900000
// @domain            www.manhuabudang.com
// ==/UserScript==

/**
 * @file 漫画补档签到脚本
 * @author yi-Xu-0100
 * @version 1.0.2
 */

/**
 * @module 漫画补档签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 * 
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.manhuabudang.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/266] - 脚本主页
 * @param {string} [loginURL = https://www.manhuabudang.com/login.php] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/漫画补档] - 脚本更新链接
 */

exports.run = async function (param) {
    var resp = await axios.get('https://www.manhuabudang.com/u.php');
    if (/您还没有登录或注册/.test(resp.data)) throw "需要登录";
    var verify = /<input type="hidden" name="verify" value="([^"]+)/.exec(resp.data);
    if (!(verify && verify[1])) throw "未找到 verify ！";
    var step = /<input type="hidden" name="step" value="([^"]+)/.exec(resp.data);
    if (!(step && step[1])) throw "未找到 step ！";
    var resp1 = await axios.post(`https://www.manhuabudang.com/jobcenter.php?action=punch&verify=${verify[1]}`,
        `step=${step[1]}`);
    var message = /message":'(.*?)'/.exec(resp1.data);
    if (!(message && message[1])) throw "签到信息中未返回 message ！";
    if (message[1] == '你已经打卡,请明天再试') return "重复签到";
    return message[1];
};

exports.check = async function (param) {
    var resp = await axios.get("https://www.manhuabudang.com/u.php");
    return !(/您还没有登录或注册/.test(resp.data));
};