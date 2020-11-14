// ==UserScript==
// @name              忍者云签到
// @namespace         https://soulsign.inu1255.cn/scripts/173
// @version           1.0.9
// @author            yi-Xu-0100
// @loginURL          https://renzhe.cloud/auth/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/忍者云签到
// @expire            900000
// @domain            renzhe.cloud
// @param            name 账户
// @param            pwd 密码
// ==/UserScript==

/**
 * @file 忍者云签到脚本
 * @author yi-Xu-0100
 * @author marvolo666
 * @version 1.0.9
 */

/**
 * @module 忍者云签到脚本
 * @description 本脚本借鉴 [marvolo666 的通用 demo 模板](https://github.com/inu1255/soulsign-chrome/blob/master/public/demos/ShadowSocksR.js)，提供设置用户名和密码方式自动登陆。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = renzhe.cloud] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/173] - 脚本主页
 * @param {string} [loginURL = https://renzhe.cloud/auth/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/忍者云签到] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

const _domain = 'renzhe.cloud';
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
    if (/登录成功/.test(data.data.msg)) return true;
    else return false;
  }
};

module.exports = { run, check };
