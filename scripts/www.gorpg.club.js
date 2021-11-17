// ==UserScript==
// @name              GORPG
// @namespace         https://soulsign.inu1255.cn/scripts/192
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://www.gorpg.club/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/GORPG
// @expire            900000
// @domain            www.gorpg.club
// ==/UserScript==

/**
 * @file GORPG签到脚本
 * @author yi-Xu-0100
 * @version 1.0.1
 */

/**
 * @module GORPG签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.gorpg.club] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/192] - 脚本主页
 * @param {string} [loginURL = https://www.gorpg.club/member.php?mod=logging&action=login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/GORPG] - 脚本更新链接
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  let resp = await axios.get(
    'https://www.gorpg.club/plugin.php?id=wq_sign&mod=mood&infloat=yes&handlekey=pc_click_wqsign&inajax=1&ajaxtarget=fwin_content_pc_click_wqsign'
  );
  if (resp.data.includes('已签到')) return '重复签到';
  if (resp.data.includes('您需要先登录才能继续本操作')) throw '需要登录';
  let result = resp.data.match(/<input type="hidden" value="(.*?)" name="formhash">/);
  if (result == null) throw resp.data;
  let resp1 = await axios.post(
    'https://www.gorpg.club/plugin.php?id=wq_sign&mod=mood&infloat=yes&confirmsubmit=yes&inajax=1',
    `confirmsubmit=yes&formhash=${result[1]}&handlekey=pc_click_wqsign&imageurl=source%2Fplugin%2Fwq_sign%2Fstatic%2Fimages%2Fwq_sign9.png&message=%C0%CB%C0%EF%B8%F6%C0%CB%C0%CB%C0%EF%B8%F6%C0%CB`
  );
  if (/今日已签/.test(resp1.data)) return '任务已完成';
  if (/需要先登录/.test(resp1.data)) throw '需要登录';
  let result1 = resp1.match(/id=wq_sign.*?(签到成功奖励.*?)'/);
  if (result1 == null) throw resp1.data;
  else return result1[1];
};

let check = async function (param) {
  let resp = await axios.get('https://www.gorpg.club/home.php?mod=spacecp&ac=usergroup');
  return !/需要先登录/.test(resp.data);
};

module.exports = { run, check };
