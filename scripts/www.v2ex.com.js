// ==UserScript==
// @name              v2ex签到
// @namespace         https://soulsign.inu1255.cn/scripts/378
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://www.v2ex.com/signin
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/v2ex签到
// @expire            900000
// @domain            www.v2ex.com
// ==/UserScript==

/**
 * @file v2ex签到脚本
 * @author yi-Xu-0100
 * @author inu1255
 * @version 1.0.1
 */

/**
 * @module v2ex签到脚本
 * @description 本脚本借鉴 [inu1255 的 v2ex签到脚本](https://soulsign.inu1255.cn/scripts/1)，更改了检查在线逻辑和签到检测逻辑。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.v2ex.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/378] - 脚本主页
 * @param {string} [loginURL = https://www.v2ex.com/signin] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/v2ex签到] - 脚本更新链接
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  var resp = await axios.get('https://www.v2ex.com/mission/daily');
  if (/你要查看的页面需要先登录/.test(resp.data)) throw '需要登录';
  if (/每日登录奖励已领取/.test(resp.data)) return '重复签到';
  var once = /redeem\?once=(.*?)'/.exec(resp.data);
  if (!once) throw '未找到 once';
  var resp1 = await axios.get(`https://www.v2ex.com/mission/daily/redeem?once=${once[1]}`);
  if (/请重新点击一次以领取每日登录奖励/.test(resp1.data)) throw '请重新签到';
  else if (/每日登录奖励已领取/.test(resp1.data)) {
    let resp = await axios.get('https://www.v2ex.com/balance');
    let today = new Date(Date.now()).toISOString().replace(/[^0-9]/g, '');
    let reward = RegExp(`${today.slice(0, 8)} 的每日登录奖励 (\\d+) 铜币`, 'g').exec(resp.data);
    if (reward) return `签到奖励: ${reward[1]} 铜币`;
    else return '成功签到';
  } else throw '无法确认签到结果';
};

let check = async function (param) {
  var resp = await axios.get('https://www.v2ex.com/t/718092');
  return !/现在注册/.test(resp.data);
};

module.exports = { run, check };
