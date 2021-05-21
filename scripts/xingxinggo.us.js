// ==UserScript==
// @name              星辰签到
// @namespace         https://soulsign.inu1255.cn/scripts/461
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://xingxinggo.us/auth/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/星辰签到
// @expire            900000
// @domain            xingxinggo.us
// @param            name 账户
// @param            pwd 密码
// ==/UserScript==

/**
 * @file 星辰签到脚本
 * @author yi-Xu-0100
 * @author marvolo666
 * @version 1.0.1
 */

/**
 * @module 星辰签到脚本
 * @description 本脚本借鉴 [marvolo666 的通用 demo 模板](https://github.com/inu1255/soulsign-chrome/blob/master/public/demos/ShadowSocksR.js)，提供设置用户名和密码方式自动登陆。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = xingxinggo.us] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/461] - 脚本主页
 * @param {string} [loginURL = https://xingxinggo.us/auth/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/星辰签到] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

const _domain = 'xingxinggo.us';
const _remember_me = 'on';

let run = async function (param) {
  if (!check(param)) throw '需要登录';
  var data = await axios.post(`https://${_domain}/user/checkin`);
  if (/成功/.test(data.data.msg)) return data.data.msg;
  else if (/您似乎已经签到过了/.test(data.data.msg)) return '重复签到';
  else if (/获得了 \d{0,4} MB流量/.test(data.data.msg)) return data.data.msg;
  else throw data.data;
};

let check = async function (param) {
  var { data } = await axios.get(`https://${_domain}/user`);
  if (/用户中心/.test(data)) return true;
  else {
    var data = await axios.post(`https://${_domain}/auth/login`, {
      email: param.name,
      passwd: param.pwd,
      remember_me: _remember_me
    });
    return /登录成功/.test(data.data.msg);
  }
};

module.exports = { run, check };
