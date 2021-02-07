// ==UserScript==
// @name              sketchupbar
// @namespace         https://soulsign.inu1255.cn/scripts/198
// @version           1.0.6
// @author            yi-Xu-0100
// @loginURL          https://www.sketchupbar.com/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/sketchupbar
// @expire            900000
// @domain            www.sketchupbar.com
// ==/UserScript==

/**
 * @file sketchupbar签到脚本
 * @author yi-Xu-0100
 * @version 1.0.6
 */

/**
 * @module sketchupbar签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.sketchupbar.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/198] - 脚本主页
 * @param {string} [loginURL = https://www.sketchupbar.com/member.php?mod=logging&action=login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/sketchupbar] - 脚本更新链接
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  var resp = await axios.get('https://www.sketchupbar.com/sign.php?mod=sign');
  var origin_hbs = resp.data.match(/<span>(.*?)<\/span>\s+<span id="hbs_info"/);
  var origin_bb = resp.data.match(/<span>(.*?)<\/span>\s+<span id="bb_info"/);
  if (/您的签到排名/.test(resp.data)) return '重复签到';
  if (/常规维护中/.test(resp.data)) throw '常规维护中';
  var result = resp.data.match(/<a id="JD_sign" class="BtBox" href="(.*?)"/);
  if (result == null) throw '需要登录';
  var signurl = result[1];
  await axios.get('https://www.sketchupbar.com/' + signurl);
  var resp1 = await axios.get('https://www.sketchupbar.com/sign.php?mod=sign');
  var rewards = '今日获得：';
  if (/您的签到排名/.test(resp1.data)) {
    let today_hbs = resp1.data.match(/<span>(.*?)<\/span>\s+<span id="hbs_info"/);
    let today_bb = resp1.data.match(/<span>(.*?)<\/span>\s+<span id="bb_info"/);
    let hbs = today_hbs[1] - origin_hbs[1];
    if (hbs) rewards = rewards + hbs + ' 红宝石，';
    let bb = today_bb[1] - origin_bb[1];
    if (bb) rewards = rewards + bb + ' 吧币，';
    let resp = await axios.post('https://www.sketchupbar.com/plugin.php?id=k_misign:get_zhuanpan');
    while (/200/.test(resp.data.code)) {
      rewards = rewards + resp.data.name + '，';
      resp = await axios.post('https://www.sketchupbar.com/plugin.php?id=k_misign:get_zhuanpan');
    }
    rewards = rewards.substr(0, rewards.length - 1);
    return rewards;
  } else throw '未成功签到';
};

let check = async function (param) {
  var resp = await axios.get('https://www.sketchupbar.com/home.php?mod=spacecp&ac=usergroup');
  return !/需要先登录/.test(resp.data);
};

module.exports = { run, check };
