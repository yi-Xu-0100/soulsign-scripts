// ==UserScript==
// @name              爱奇艺签到
// @namespace         https://soulsign.inu1255.cn/scripts/290
// @version           1.0.0
// @author            yi-Xu-0100
// @loginURL          https://www.iqiyi.com/u/accountset
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/爱奇艺签到
// @expire            900000
// @domain            www.iqiyi.com
// @domain            tc.vip.iqiyi.com
// @grant             cookie
// ==/UserScript==

/**
 * @file 爱奇艺签到脚本
 * @author yi-Xu-0100
 * @version 1.0.0
 */

/**
 * @module geekhub签到脚本
 * @description  本脚本借鉴 [NobyDa/Script](https://github.com/NobyDa/Script/blob/42e6e1978fed46f531666d0db096b67858592fda/iQIYI-DailyBonus/iQIYI.js)，需要 cookie 权限获取签到相关参数。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = [www.iqiyi.com, tc.vip.iqiyi.com]] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/290] - 脚本主页
 * @param {string} [loginURL = https://www.iqiyi.com/u/accountset] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/爱奇艺签到] - 脚本更新链接
 */

exports.run = async function (param) {
  var cookie = await getCookie('https://www.iqiyi.com/', 'P00001');
  if (cookie == null) throw '需要登录';
  var resp = await axios.get(
    `https://tc.vip.iqiyi.com/taskCenter/task/queryUserTask?autoSign=yes&P00001=${cookie}`
  );
  if (resp.data.msg === '成功') {
    var signInfo = resp.data.data.signInfo;
    if (signInfo.code === 'SIGNED') return '重复签到';
    else if (signInfo.code === 'A00000')
      return (
        `会员到期日期：${expire}\n` +
        signInfo.data.rewards[0].name +
        signInfo.data.rewards[0].value +
        `\n连续签到 ${continued} 天`
      );
    else throw signInfo.msg;
  } else throw 'Cookie 无效';
};

exports.check = async function (param) {
  return !!(await getCookie('https://www.iqiyi.com/', 'P00001'));
};
