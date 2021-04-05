// ==UserScript==
// @name              威锋网
// @namespace         https://soulsign.inu1255.cn/scripts/235
// @version           2.0.1
// @author            yi-Xu-0100
// @loginURL          https://www.feng.com/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/威锋网
// @expire            900000
// @domain            api.wfdata.club
// @grant             cookie
// ==/UserScript==

/**
 * @file 威锋网签到脚本
 * @author yi-Xu-0100
 * @version 2.0.1
 */

/**
 * @module 威锋网签到脚本
 * @description 脚本需要 cookies 权限来获取签到时所需的参数。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = api.wfdata.club] - 请求的域名
 * @param {string|string[]} [grant = cookie] - 脚本需要的权限
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/235] - 脚本主页
 * @param {string} [loginURL = https://www.feng.com/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/威锋网] - 脚本更新链接
 */

let getAccessToken = async function (param) {
  const userInfo = decodeURI(await getCookie('https://www.feng.com/', 'userInfo')) || '';
  const _userInfo = JSON.parse(userInfo.replace(/%2C/g, ',')) || '';
  return {
    success: !!_userInfo,
    accessToken: _userInfo && _userInfo.accessToken
  };
};

let run = async function (param) {
  var { success, accessToken } = await getAccessToken(param);
  if (!success) throw '需要登录';
  var resp = await axios.post('https://api.wfdata.club/v1/attendance/userSignIn', null, {
    headers: {
      Origin: 'https://www.feng.com',
      Referer: 'https://www.feng.com/',
      'X-Access-Token': accessToken,
      'X-Request-Id':
        'WDQKt2+dxMxPlIA4Wz5yf9l2x4N3rKqe65uuHK/Bejm6cq2x+lRoLS/siKDj7nXSrgqqil/hlN2F6raY0+8X5Q=='
    }
  });
  if (resp.data.status.message === 'success') {
    return (
      `获得经验 ${resp.data.data.getWeTicket} 点` +
      (resp.data.data.extraWeTicket != '0' ? `，额外经验 ${resp.data.data.extraWeTicket} 点` : '')
    );
  } else if (/重复签到/.test(resp.data.status.message)) return '重复签到';
  else throw resp.data.status.message;
};

let check = async function (param) {
  return (await getAccessToken(param)).success;
};

module.exports = { run, check };
