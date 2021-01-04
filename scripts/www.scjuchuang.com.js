// ==UserScript==
// @name              聚创
// @namespace         https://soulsign.inu1255.cn/scripts/186
// @version           1.0.6
// @author            yi-Xu-0100
// @loginURL          https://www.scjuchuang.com/login/index
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/聚创
// @expire            900000
// @domain            www.scjuchuang.com
// @param            name 账户
// @param            pwd 加密密码
// ==/UserScript==

/**
 * @file 聚创签到脚本
 * @author yi-Xu-0100
 * @version 1.0.6
 */

/**
 * @module 聚创签到脚本
 * @description 本脚本提供设置用户名和密码方式自动登陆。但是网站应自定义一个 `userinfo` 的 `cookie` 条目作为部分页面判断登录状态依据，脚本无法完成该设置。如果网页提示信息有问题，请访问 [聚创医药网登录页面](https://www.scjuchuang.com/login) 重新登录。
 * 
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.scjuchuang.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/186] - 脚本主页
 * @param {string} [loginURL = https://www.scjuchuang.com/login/index] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/聚创] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 加密密码
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  var resp = await axios.post('https://www.scjuchuang.com/api/signin', null, {
    headers: {
      Origin: 'https://www.scjuchuang.com',
      Referer: 'https://www.scjuchuang.com/intergralSigin'
    }
  });
  if (/签到成功/.test(resp.data.msg))
    return `今日获得 ${resp.data.data.integral}积分，已连续签到 ${resp.data.data.continue_count} 天`;
  if (/今日已签到/.test(resp.data.msg)) return '重复签到';
  throw resp.data;
};

let check = async function (param) {
  var resp = await axios.get('https://www.scjuchuang.com/index');
  if (!/进入会员中心/.test(resp.data)) {
    await axios.post(
      'https://www.scjuchuang.com/api/login',
      { username: param.name, password: param.pwd },
      {
        headers: {
          Origin: 'https://www.scjuchuang.com',
          Referer: 'https://www.scjuchuang.com/login/index',
          'X-Requested-With': 'XMLHttpRequest'
        }
      }
    );
    let resp = await axios.get('https://www.scjuchuang.com/index');
    return /进入会员中心/.test(resp.data);
  } else return true;
};

module.exports = { run, check };
