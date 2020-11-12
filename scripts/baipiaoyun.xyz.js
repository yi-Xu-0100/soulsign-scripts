// ==UserScript==
// @name              白嫖云签到
// @namespace         https://soulsign.inu1255.cn/scripts/293
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://baipiaoyun.xyz/auth/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/白嫖云签到
// @expire            900000
// @domain            baipiaoyun.xyz
// @param            name 账户
// @param            pwd 密码
// ==/UserScript==

/**
 * @file 白嫖云签到脚本
 * @author yi-Xu-0100
 * @author marvolo666
 * @version 1.0.1
 */

/**
 * @module 白嫖云签到脚本
 * @description 本脚本借鉴 [marvolo666 的通用 demo 模板](https://github.com/inu1255/soulsign-chrome/blob/master/public/demos/ShadowSocksR.js)，提供设置用户名和密码方式自动登陆。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = baipiaoyun.xyz] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/293] - 脚本主页
 * @param {string} [loginURL = https://portal.nonsense.cloud/auth/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/白嫖云签到] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

exports.run = async function (param) {
  var resp = await axios.post('https://baipiaoyun.xyz/user/checkin');
  if (/成功/.test(resp.data.msg)) return resp.data.msg;
  else if (/您似乎已经签到过了/.test(resp.data.msg)) return '重复签到';
  else if (/获得了 \d+MB 流量/.test(resp.data.msg)) return resp.data.msg;
  else throw resp.data;
};

exports.check = async function (param) {
  var resp = await axios.get('https://baipiaoyun.xyz/user');
  if (/用户中心/.test(resp.data)) return true;
  else {
    let resp = await axios.post('https://baipiaoyun.xyz/auth/login', {
      email: param.name,
      passwd: param.pwd,
      remember_me: 'week'
    });
    return /登录成功/.test(resp.data.msg);
  }
};
