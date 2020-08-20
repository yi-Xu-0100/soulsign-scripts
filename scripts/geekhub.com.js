// ==UserScript==
// @name              geekhub
// @namespace         https://soulsign.inu1255.cn/scripts/172
// @version           1.1.1
// @author            yi-Xu-0100
// @loginURL          https://geekhub.com/users/sign_in
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/geekhub
// @expire            900000
// @domain            geekhub.com
// ==/UserScript==

/**
 * @file geekhub签到脚本
 * @author yi-Xu-0100
 * @version 1.1.1
 */

/**
 * @module geekhub签到脚本
 * @description  脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 * 
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = geekhub.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/172] - 脚本主页
 * @param {string} [loginURL = https://geekhub.com/users/sign_in] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/geekhub] - 脚本更新链接
 */

exports.run = async function (param) {
    let resp = await axios.get("https://geekhub.com/checkins");
    if (resp.data.includes("今日已签到")) return "重复签到";
    if (resp.data.includes("您需要登录后才能继续")) throw "未登录";
    let result = resp.data.match(/<meta name="csrf-token" content="(.*?)"/);
    let originGbit = resp.data.match(/<div class="w-3\/12">\s+<div>(\d*)<\/div>/) ||
        resp.data.match(/<div class="flex-1 text-center">\s+<div>(\d*)<\/div>\s+<div>Gbit/);
    let resp1 = await axios.post('https://geekhub.com/checkins/start',
        "_method=post&authenticity_token=" + encodeURIComponent(result[1]),
        {
            headers: {
                "Origin": "https://geekhub.com",
                "Referer": "https://geekhub.com/checkins"
            }
        });
    if (/今日已签到/.test(resp1.data)) {
        let todayGbit = resp1.data.match(/<div class="w-3\/12">\s+<div>(\d*)<\/div>/) ||
            resp1.data.match(/<div class="flex-1 text-center">\s+<div>(\d*)<\/div>\s+<div>Gbit/);
        return "今日获得 " + (todayGbit[1] - originGbit[1]) + " Gbit";
    } else throw (/您需要登录后才能继续/.test(resp1.data)) ? "未登录" : "签到失败";
};

exports.check = async function (param) {
    let resp = await axios.get("https://geekhub.com/checkins");
    return !(/您需要登录后才能继续/.test(resp.data));
};