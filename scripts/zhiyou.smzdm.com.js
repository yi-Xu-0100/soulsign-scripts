// ==UserScript==
// @name              什么值得买
// @namespace         https://soulsign.inu1255.cn/scripts/206
// @version           1.0.2
// @author            yi-Xu-0100
// @loginURL          https://zhiyou.smzdm.com/user/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/什么值得买
// @expire            900000
// @domain            zhiyou.smzdm.com
// ==/UserScript==

/**
 * @file 什么值得买签到脚本
 * @author yi-Xu-0100
 * @author inu1255
 * @version 1.0.2
 */

/**
 * @module 什么值得买签到脚本
 * @description 本脚本借鉴 [inu1255 的什么值得买签到脚本](https://soulsign.inu1255.cn/scripts/2)，更改了检查在线逻辑。
 * 
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 * 
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = zhiyou.smzdm.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/206] - 脚本主页
 * @param {string} [loginURL = https://zhiyou.smzdm.com/user/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/什么值得买] - 脚本更新链接
 */

exports.run = async function (param) {
    var { data } = await axios.get('https://zhiyou.smzdm.com/user/checkin/jsonp_checkin', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    if (data.error_code == 0) return '已连续签到 ' + data.data.checkin_num + " 天";
    throw data.error_msg || "签到失败";
};

exports.check = async function (param) {
    var { data } = await axios.get('https://zhiyou.smzdm.com/user/', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    return /个人中心 \| 什么值得买/.test(data);
};