// ==UserScript==
// @name              GORPG
// @namespace         https://soulsign.inu1255.cn/scripts/192
// @version           1.0.0
// @author            yi-Xu-0100
// @loginURL          https://www.gorpg.club/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/GORPG
// @expire            900000
// @domain            www.gorpg.club
// ==/UserScript==

/**
 * @file GORPG签到脚本
 * @author yi-Xu-0100
 * @version 1.0.0
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

exports.run = async function (param) {
  // 签到的页面
  let resp = await axios.get('https://www.gorpg.club/plugin.php?id=k_misign:sign');
  let signhtml = resp.data;
  if (signhtml.includes('您的签到排名')) {
    return '已经签到过';
  }
  let result = signhtml.match(/<a id="JD_sign" href="(.*?)"/);
  if (result == null) {
    throw '未登录';
  }
  let signurl = result[1];
  var { data } = await axios.get('https://www.gorpg.club/' + signurl);
  if (/今日已签/.test(data)) return '任务已完成';
  if (/需要先登录/.test(data)) throw '未登录';
  let resp1 = await axios.get('https://www.gorpg.club/plugin.php?id=k_misign:sign');
  let signhtml1 = resp1.data;
  if (signhtml1.includes('您的签到排名')) {
    let result1 = signhtml1.match(
      /<input type="hidden" class="hidnum" id="lxreward" value="(.*?)"/
    );
    return '积分奖励: ' + result1[1] + ' 秘石';
  } else throw '未成功签到';
};

exports.check = async function (param) {
  var { status, data } = await axios.get(
    'https://www.gorpg.club/home.php?mod=spacecp&ac=usergroup',
    {
      maxRedirects: 0
    }
  );
  if (/需要先登录/.test(data)) return false;
  return true;
};
