// ==UserScript==
// @name              科研通
// @namespace         https://soulsign.inu1255.cn/scripts/414
// @version           1.0.0
// @author            yi-Xu-0100
// @loginURL          https://www.ablesci.com/my/info
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/科研通
// @expire            900000
// @domain            www.ablesci.com
// @param            name 账户
// @param            pwd 密码
// ==/UserScript==

/**
 * @file 科研通签到脚本
 * @author yi-Xu-0100
 * @version 1.0.0
 */

/**
 * @module 科研通签到脚本
 * @description  本脚本提供设置用户名和密码方式自动登陆。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.ablesci.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/414] - 脚本主页
 * @param {string} [loginURL = https://www.ablesci.com/my/info] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/科研通] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  let resp = await axios.get('https://www.ablesci.com/');
  if (/class="sign-no" style=" display: none "/.test(resp.data)) return '重复签到';
  let resp1 = await axios.get('https://www.ablesci.com/user/sign');
  if (resp1.data.code === 0) return `签到奖励: ${resp1.data.data.signpoint} 积分`;
  else if (/签到失败，您今天已于 (.*)? 签到。/.test(resp1.data.msg)) return '重复签到';
  else throw resp1.data;
};

let check = async function (param) {
  var resp = await axios.get('https://www.ablesci.com/my/info');
  if (/对不起，您的操作需要登录才可以进行。/.test(resp.data)) {
    let _csrf = /name="_csrf" id="csrf-val" value="([^"]+)/.exec(resp.data);
    console.log('_csrf: ' + _csrf);
    if (_csrf == null) return false;
    await axios.post(
      'https://www.ablesci.com/site/login',
      {
        _csrf: _csrf[1],
        email: param.name,
        password: param.pwd,
        remember_me: 'on'
      },
      {
        transformRequest: [
          function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret.substr(0, ret.length - 1);
          }
        ]
      }
    );
    let resp1 = await axios.get('https://www.ablesci.com/my/info');
    return /账号设置/.test(resp1.data);
  } else return true;
};

module.exports = { run, check };
