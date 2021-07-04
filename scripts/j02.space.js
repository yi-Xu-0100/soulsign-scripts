// ==UserScript==
// @name              几鸡签到
// @namespace         https://soulsign.inu1255.cn/scripts/480
// @version           1.0.0
// @author            yi-Xu-0100
// @loginURL          https://j02.space/signin
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/几鸡签到
// @expire            900000
// @domain            j02.space
// @param            name 账户
// @param            pwd 密码
// ==/UserScript==

/**
 * @file 几鸡签到脚本
 * @author yi-Xu-0100
 * @version 1.0.0
 */

/**
 * @module 几鸡签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = https://j02.space/] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/480] - 脚本主页
 * @param {string} [loginURL = https://j02.space/signin] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/几鸡签到] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

let run = async function (param) {
  if (!check(param)) throw '需要登录';
  var resp = await axios.post(`https://j02.space/user/checkin`);
  if (/您似乎已经签到过了/.test(resp.data.msg)) return '重复签到';
  else if (/获得了\s?\d{0,8}\s?MB\s?流量/.test(resp.data.msg)) return resp.data.msg;
  else throw resp.data;
};

let check = async function (param) {
  var resp = await axios.get(`https://j02.space/xiaoma/get_user`);
  if (/301/.test(resp.data.code)) {
    let resp = await axios.post(`https://j02.space/signin`, {
      email: param.name,
      passwd: param.pwd,
    });
    if(!/200/.test(resp.data.code)) {
      console.log(`几鸡签到：check() error, resp.data: ${JSON.stringify(resp.data)}`);
      return false;
    }
    resp = await axios.get(`https://j02.space/user`);
    resp = await axios.get(`https://j02.space/xiaoma/get_user`);
    return !/301/.test(resp.data.code);
  } else return true;
};

module.exports = { run, check };
