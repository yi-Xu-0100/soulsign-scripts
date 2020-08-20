// ==UserScript==
// @name              wps打卡领会员
// @namespace         https://soulsign.inu1255.cn?account=inu1255
// @version           1.0.3
// @author            inu1255
// @loginURL          https://zt.wps.cn/2018/clock_in
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/wps打卡领会员
// @expire            900000
// @domain            zt.wps.cn
// ==/UserScript==

/**
 * @file wps打卡领会员签到脚本
 * @author inu1255
 * @version 1.0.3
 */

/**
 * @module wps打卡领会员签到脚本
 * @description 本脚本是 [inu1255](https://github.com/inu1255) 所创造，现在该脚本**已失效**！
 * @param {string|string[]} [domain = zt.wps.cn] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/7] - 脚本主页
 * @param {string} [loginURL = https://zt.wps.cn/2018/clock_in] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/inu1255/wps打卡领会员] - 脚本更新链接
 */

exports.run = async function () {
    var { status, data } = await axios.get('https://zt.wps.cn/2018/clock_in/api/get_question', { maxRedirects: 0, validateStatus: s => true });
    if (status == 302) throw '需要登录';
    let answer = 1;
    for (let i = 0; i < data.data.options.length; i++) {
        let row = data.data.options[i];
        if (/WPS/.test(row)) {
            answer = i + 1;
            break;
        }
    }
    var { data } = await axios.post('https://zt.wps.cn/2018/clock_in/api/answer', { answer });
    if (data.result != 'ok') throw data.msg;
    var { data } = await axios.get('https://zt.wps.cn/2018/clock_in/api/clock_in');
    if (data.msg == '已打卡') return '已打卡';
    if (data.msg == '不在打卡时间内') return '不在打卡时间内';
    if (data.result != 'ok') throw data.msg;
};

exports.check = async function () {
    var { data } = await axios.get('https://zt.wps.cn/2018/clock_in/api/sign_up?sid=0&from=&csource=');
    return data.msg == '已参加挑战' || data.result == 'ok';
};