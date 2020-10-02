// ==UserScript==
// @name              bilibili直播
// @namespace         https://soulsign.inu1255.cn?account=inu1255
// @version           1.0.2
// @author            inu1255
// @loginURL          https://passport.bilibili.com/login
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/bilibili直播
// @expire            900000
// @domain            api.live.bilibili.com
// ==/UserScript==

/**
 * @file bilibili直播签到脚本
 * @author inu1255
 * @version 1.0.2
 */

/**
 * @module bilibili直播签到脚本
 * @description 本脚本是 [inu1255](https://github.com/inu1255) 所创造。
 * @param {string|string[]} [domain = api.live.bilibili.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/10] - 脚本主页
 * @param {string} [loginURL = https://passport.bilibili.com/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/inu1255/bilibili直播] - 脚本更新链接
 */

exports.run = async function (param) {
  var { data } = await axios.get('https://api.live.bilibili.com/sign/doSign');
  if (data.code == 0) return data.data.text;
  if (data.code == 1011040) return data.message;
  throw data.message;
};

exports.check = async function (param) {
  var { data } = await axios.get('https://api.live.bilibili.com/relation/v1/Feed/heartBeat');
  return data.code === 0;
};
