// ==UserScript==
// @name              bilibili直播
// @namespace         https://soulsign.inu1255.cn/scripts/590
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://passport.bilibili.com/login
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/bilibili直播
// @expire            900000
// @domain            api.live.bilibili.com
// ==/UserScript==

/**
 * @file bilibili直播签到脚本
 * @author yi-Xu-0100
 * @author inu1255
 * @version 1.0.1
 */

/**
 * @module bilibili直播签到脚本
 * @description 本脚本借鉴 [inu1255 的 bilibili直播签到脚本](https://soulsign.inu1255.cn/scripts/10)，修改了检查在线的逻辑。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = api.live.bilibili.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/10] - 脚本主页
 * @param {string} [loginURL = https://passport.bilibili.com/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/inu1255/bilibili直播] - 脚本更新链接
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  var resp1 = await axios.get('https://api.live.bilibili.com/sign/doSign');
  if (resp1.data.code == 0) return resp1.data.data.text;
  if (resp1.data.code == 1011040) return '重复签到';
  throw resp1.data.message;
};

let check = async function (param) {
  var resp = await axios.get('https://api.live.bilibili.com/xlive/web-ucenter/user/get_user_info');
  return resp.data.code === 0;
};

module.exports = { run, check };
