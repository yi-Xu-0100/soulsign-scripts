// ==UserScript==
// @name              迅维网
// @namespace         https://soulsign.inu1255.cn/scripts/238
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://www.chinafix.com/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/迅维网
// @expire            900000
// @domain            www.chinafix.com
// ==/UserScript==

/**
 * @file 迅维网签到脚本
 * @author yi-Xu-0100
 * @version 1.0.1
 */

/**
 * @module 迅维网签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.chinafix.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/238] - 脚本主页
 * @param {string} [loginURL = https://www.chinafix.com/member.php?mod=logging&action=login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/迅维网] - 脚本更新链接
 */

exports.run = async function (param) {
  let resp = await axios.get('https://www.chinafix.com/plugin.php?id=k_misign:sign');
  if (resp.data.includes('您的签到排名')) return '已经签到过';
  let result = resp.data.match(/<a id="JD_sign" href="(.*?)"/);
  if (result == null) throw '未登录';
  resp = await axios.get('https://www.chinafix.com/' + result[1]);
  if (/您所在用户组不允许使用/.test(resp.data)) throw '您所在用户组不允许使用';
  if (/今日已签/.test(resp.data)) return '重复签到';
  if (/需要先登录/.test(resp.data)) throw '未登录';
  resp = await axios.get('https://www.chinafix.com/plugin.php?id=k_misign:sign');
  if (resp.data.includes('您的签到排名')) {
    let result1 = resp.data.match(
      /<input type="hidden" class="hidnum" id="lxreward" value="(.*?)"/
    );
    return '积分奖励: ' + result1[1] + ' 下载分';
  } else throw '未成功签到';
};

exports.check = async function (param) {
  let resp = await axios.get('https://www.chinafix.com/home.php?mod=spacecp&ac=usergroup');
  return !/需要先登录/.test(resp.data);
};
