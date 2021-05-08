// ==UserScript==
// @name              网易云音乐
// @namespace         https://soulsign.inu1255.cn/scripts/233
// @version           1.0.6
// @author            yi-Xu-0100
// @loginURL          https://music.163.com/#/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/网易云音乐
// @expire            900000
// @domain            music.163.com
// ==/UserScript==

/**
 * @file 网易云音乐签到脚本
 * @author yi-Xu-0100
 * @author inu1255
 * @version 1.0.6
 */

/**
 * @module 网易云音乐签到脚本
 * @description 本脚本借鉴 [inu1255 的网易云音乐签到脚本](https://soulsign.inu1255.cn/scripts/3)，更改了检查在线逻辑和签到反馈消息。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = music.163.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/233] - 脚本主页
 * @param {string} [loginURL = https://music.163.com/#/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/网易云音乐] - 脚本更新链接
 */

const run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  // 移动端签到（10 云贝）
  const resp = await axios.get('https://music.163.com/api/point/dailyTask?type=0');
  if (resp.data.code !== 200 && resp.data.code !== -2) throw resp.data.msg;

  // 桌面端签到（5 云贝）
  const resp1 = await axios.get('https://music.163.com/api/point/dailyTask?type=1');
  if (resp1.data.code !== 200 && resp1.data.code !== -2) throw resp.data.msg;

  if (resp.data.code === 200 && resp1.data.code === 200) {
    return `获得 ${resp.data.point + resp1.data.point} 云贝`;
  } else if (resp.data.code === -2 && resp1.data.code === 200) {
    return `获得 ${resp1.data.point} 云贝，移动端已签到`;
  } else if (resp.data.code === 200 && resp1.data.code === -2) {
    return `获得 ${resp.data.point} 云贝，桌面端已签到`;
  } else return '桌面端、移动端均已签到';
};

const check = async function (param) {
  const resp = await axios.get('https://music.163.com/');
  return !/GUser={}/.test(resp.data);
};

module.exports = { run, check };
