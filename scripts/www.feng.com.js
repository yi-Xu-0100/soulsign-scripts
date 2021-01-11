// ==UserScript==
// @name              威锋网
// @namespace         https://soulsign.inu1255.cn/scripts/235
// @version           1.0.4
// @author            yi-Xu-0100
// @loginURL          https://www.feng.com/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/威锋网
// @expire            900000
// @domain            api.wfdata.club
// @param            name 账户
// @param            pwd 密码
// ==/UserScript==

/**
 * @file 威锋网签到脚本
 * @author yi-Xu-0100
 * @version 1.0.4
 */

/**
 * @module 威锋网签到脚本
 * @description 脚本提供设置用户名和密码方式自动签到，但 cookie 信息无法保存，即不会自动登录。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = api.wfdata.club] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/235] - 脚本主页
 * @param {string} [loginURL = https://www.feng.com/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/威锋网] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

let signIn = async function (param) {
  var resp = await axios.post(
    'https://api.wfdata.club/v1/auth/signin',
    `account=${param.name}&password=${param.pwd}`,
    {
      headers: {
        Origin: 'https://www.feng.com',
        Referer: 'https://www.feng.com/',
        'X-Request-Id': 'qPGH1Pl6jyF+VvNdxEXgW6aHNVBxUVKXSc7hkhT2pscrDyUYqDl8pRBd3pjdWqOX'
      }
    }
  );
  return {
    success: resp.data.status.message === 'success',
    accessToken: resp.data.data.accessToken
  };
};

let run = async function (param) {
  var { success, accessToken } = await signIn(param);
  if (!success) throw '需要登录';
  var resp = await axios.post('https://api.wfdata.club/v1/attendance/userSignIn', null, {
    headers: {
      Origin: 'https://www.feng.com',
      Referer: 'https://www.feng.com/',
      'X-Access-Token': accessToken,
      'X-Request-Id':
        'WDQKt2+dxMxPlIA4Wz5yf9l2x4N3rKqe65uuHK/Bejny5n6HnQFQ/1M4IAalbcTwRCmIXqT4sbZkc9yl1tAlfA=='
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
  return (await signIn(param)).success;
};

module.exports = { run, check };
