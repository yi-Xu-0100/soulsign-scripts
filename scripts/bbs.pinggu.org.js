// ==UserScript==
// @name              人大经济论坛
// @namespace         https://soulsign.inu1255.cn/scripts/249
// @version           1.0.4
// @author            yi-Xu-0100
// @loginURL          https://bbs.pinggu.org/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/人大经济论坛
// @expire            900000
// @domain            bbs.pinggu.org
// ==/UserScript==

/**
 * @file 人大经济论坛签到脚本
 * @author yi-Xu-0100
 * @author hithy123
 * @version 1.0.4
 */

/**
 * @module 人大经济论坛签到脚本
 * @description 本脚本借鉴 [hithy123 的人大经济论坛签到脚本](https://soulsign.inu1255.cn/scripts/225)，增加签到奖励信息反馈，更改了检查在线逻辑，设置了通用模板格式。
 * 
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 * 
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = bbs.pinggu.org] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/249] - 脚本主页
 * @param {string} [loginURL = https://bbs.pinggu.org/member.php?mod=logging&action=login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/人大经济论坛] - 脚本更新链接
 */

var domainurl = "https://bbs.pinggu.org/";

exports.run = async function (param) {
    var signurl = domainurl + "plugin.php?id=dsu_paulsign:sign";
    var { data } = await axios.get(signurl);
    if (/需要先登录/.test(data)) throw "需要登录";
    if (/已经签到/.test(data)) return "重复签到";
    var formhash = /name="formhash" value="([^"]+)/.exec(data)[1];
    var { data } = await axios.post(signurl + '&operation=qiandao&infloat=1&inajax=1',
        `formhash=${formhash}&qdxq=kx`);
    var reward = /<div class="c">[\r\s\n]*(.*?)<[\/]?div/.exec(data);
    if (reward && /已经签到/.test(reward[1])) return "重复签到";
    if (reward && /签到成功/.test(reward[1])) return reward[1];
    throw '签到失败';
};

exports.check = async function (param) {
    var { data } = await axios.get(domainurl + 'home.php?mod=spacecp');
    return !(/先登录/.test(data));
};