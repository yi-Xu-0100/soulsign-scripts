// ==UserScript==
// @name              凌云风账号
// @namespace         https://soulsign.inu1255.cn/scripts/607
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://account.lingfengyun.com/login.aspx
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/凌云风账号
// @expire            900000
// @domain            account.lingfengyun.com
// ==/UserScript==

/**
 * @file 凌云风账号签到脚本
 * @author yi-Xu-0100
 * @version 1.0.1
 */

/**
 * @module 凌云风账号签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = account.lingfengyun.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/607] - 脚本主页
 * @param {string} [loginURL = https://account.lingfengyun.com/login.aspx] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/凌云风账号] - 脚本更新链接
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  let resp = await axios.post('https://account.lingfengyun.com/user_ajax.aspx?id=sign');
  if (resp.data === 'Ucode_Err') throw '需要登录';
  if (resp.data === 'Success') return '签到成功';
  if (resp.data === 'Already_exist') return '重复签到';
  throw resp.data;
};

let check = async function (param) {
  let resp = await axios.get('https://account.lingfengyun.com/index.aspx');
  return !/找回密码/.test(resp.data);
};

module.exports = { run, check };
