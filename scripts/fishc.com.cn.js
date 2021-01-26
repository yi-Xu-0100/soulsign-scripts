// ==UserScript==
// @name              鱼C论坛
// @namespace         https://soulsign.inu1255.cn/scripts/392
// @version           1.0.0
// @author            yi-Xu-0100
// @loginURL          https://fishc.com.cn
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/鱼C论坛
// @expire            900000
// @domain            fishc.com.cn
// @param             name 账户
// @param             pwd 密码
// ==/UserScript==

/**
 * @file 鱼C论坛签到脚本
 * @author yi-Xu-0100
 * @author ViCrack
 * @version 1.0.0
 */

/**
 * @module 鱼C论坛签到脚本
 * @description 本脚本借鉴 [Vicrack 的鱼C论坛脚本](https://soulsign.inu1255.cn/scripts/167)，提供设置用户名和密码方式自动登陆，其中密码为真实密码的 MD5 加密后的密钥。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = fishc.com.cn] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/392] - 脚本主页
 * @param {string} [loginURL = https://fishc.com.cn] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/鱼C论坛] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

let run = async function (param) {
  if (!(await check(param))) return '需要登录';
  var resp = await axios.get('https://fishc.com.cn/plugin.php?id=k_misign:sign');
  if (/您的签到排名/.test(resp.data)) return '重复签到';
  let result = resp.data.match(/<a id="JD_sign" href="(.*?)"/);
  if (result == null) return 'Not found JD_sign';
  var resp1 = await axios.get('https://fishc.com.cn/' + result[1]);
  if (/今日已签/.test(resp1.data)) return '重复签到';
  if (/需要先登录/.test(resp1.data)) throw '需要登录';
  var resp2 = await axios.get('https://fishc.com.cn/plugin.php?id=k_misign:sign');
  if (/'您的签到排名'/.test(resp2.data)) {
    let result = resp2.data.match(/class="hidnum" id="lxreward" value="(.*?)"/);
    return '签到奖励: ' + result[1] + ' 鱼币';
  } else throw '未成功签到';
};

let check = async function (param) {
  var resp = await axios.get('https://fishc.com.cn/home.php?mod=spacecp&ac=usergroup');
  if (/需要先登录/.test(resp.data)) {
    let resp = await axios.post(
      'https://fishc.com.cn/member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes&inajax=1',
      `username=${param.name}&cookietime=2592000&password=${param.pwd}&quickforward=yes&handlekey=ls`
    );
    return !/登录失败/.test(resp.data);
  } else return true;
};

module.exports = { run, check };
