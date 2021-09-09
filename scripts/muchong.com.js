// ==UserScript==
// @name              小木虫签到
// @namespace         https://soulsign.inu1255.cn/scripts/537
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          http://muchong.com/bbs/logging.php?action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/小木虫签到
// @expire            900000
// @domain            muchong.com
// ==/UserScript==

/**
 * @file 小木虫签到脚本
 * @author yi-Xu-0100
 * @version 1.0.1
 */

/**
 * @module 小木虫签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = muchong.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/537] - 脚本主页
 * @param {string} [loginURL = http://muchong.com/bbs/logging.php?action=login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/小木虫签到] - 脚本更新链接
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  let resp = await axios.get('http://muchong.com/bbs/memcp.php?action=getcredit');
  if (/您已经领取今天的红包啦/.test(resp.data)) return '重复签到';
  let formhash = /name="formhash" value="([^"]+)/.exec(resp.data);
  if (formhash == null) throw 'Not found formhash';
  let resp1 = await axios.post(
    'http://muchong.com/bbs/memcp.php?action=getcredit',
    `getmode=1&creditsubmit=1&formhash=${formhash[0]}`
  );
  let coin = />(\d+?)<\/span>[\s\n\r]+?个金币大礼包！/.exec(resp1.data);
  if (coin) return `获得 ${coin[1]} 个金币`;
  else throw 'Not found coin';
};

let check = async function (param) {
  let resp = await axios.get('http://muchong.com/bbs/memcp.php?action=getcredit');
  return !/您还没有登录/.test(resp.data);
};

module.exports = { run, check };
