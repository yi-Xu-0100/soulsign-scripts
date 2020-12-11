// ==UserScript==
// @name              geekhub
// @namespace         https://soulsign.inu1255.cn/scripts/172
// @version           1.2.0
// @author            yi-Xu-0100
// @loginURL          https://www.geekhub.com/users/sign_in
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/geekhub
// @expire            900000
// @domain            www.geekhub.com
// ==/UserScript==

/**
 * @file geekhub签到脚本
 * @author yi-Xu-0100
 * @version 1.2.0
 */

/**
 * @module geekhub签到脚本
 * @description  脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.geekhub.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/172] - 脚本主页
 * @param {string} [loginURL = https://www.geekhub.com/users/sign_in] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/geekhub] - 脚本更新链接
 */

function getGbit(data) {
  geekModeGbit = data.match(
    /<div class="flex items-center mx-3 mb-5 divide-x divide-primary-500 minor">\s+<div class="flex-1 flex flex-col items-center justify-center">\s+<div>(\d*?)<\/div>/
  );
  classicalModeGbit = data.match(/<div class="w-3\/12">\s+<div>(\d*)<\/div>/);
  if (geekModeGbit == null && classicalModeGbit == null) return [false, 'noGbit'];
  else if (geekModeGbit != null) {
    console.log(`geekModeGbit: ${geekModeGbit[1]}`);
    return [true, geekModeGbit[1]];
  } else if (classicalModeGbit != null) {
    console.log(`classicalModeGbit: ${classicalModeGbit[1]}`);
    return [true, classicalModeGbit[1]];
  }
}
let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  let resp = await axios.get('https://www.geekhub.com/checkins');
  if (/今日已签到/.test(resp.data)) return '重复签到';
  let result = resp.data.match(/<meta name="csrf-token" content="(.*?)"/);
  let originGbit = getGbit(resp.data);
  if (originGbit[0]) console.log(`originGbit: ${originGbit[1]}`);
  let resp1 = await axios.post(
    'https://www.geekhub.com/checkins/start',
    '_method=post&authenticity_token=' + encodeURIComponent(result[1]),
    {
      headers: {
        Origin: 'https://www.geekhub.com',
        Referer: 'https://www.geekhub.com/checkins'
      }
    }
  );
  if (/今日已签到/.test(resp1.data)) {
    let todayGbit = getGbit(resp1.data);
    if (todayGbit[0]) console.log(`todayGbit: ${todayGbit[1]}`);
    if (!originGbit[0] && !todayGbit[0]) return '成功签到，但无法获取 Gbit 数量';
    else return '今日获得 ' + (todayGbit[1] - originGbit[1]) + ' Gbit';
  } else throw /你需要登录后才能继续/.test(resp1.data) ? '需要登录' : '签到失败';
};

let check = async function (param) {
  let resp = await axios.get('https://www.geekhub.com/settings');
  return !/你需要登录后才能继续/.test(resp.data);
};

module.exports = { run, check };
