// ==UserScript==
// @name              书香门第论坛
// @namespace         https://soulsign.inu1255.cn/scripts/690
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          http://www.txtnovel.pro/
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/书香门第论坛
// @expire            900000
// @domain           www.txtnovel.pro
// @param            name gbk编码账户
// @param            pwd 密码
// ==/UserScript==

/**
 * @file 书香门第论坛签到脚本
 * @author yi-Xu-0100
 * @version 1.0.1
 */

/**
 * @module 书香门第论坛签到脚本
 * @description 本脚本提供设置用户名和密码方式自动登陆，用户名为 gbk 编码下的名称，建议在 devtool 中复制请求参数。
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.txtnovel.pro] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/690] - 脚本主页
 * @param {string} [loginURL = http://www.txtnovel.pro/] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/书香门第论坛] - 脚本更新链接
 * @param {string} name - gbk编码账户
 * @param {string} pwd - 密码
 */

const domainurl = 'http://www.txtnovel.pro/';

let run = async function (param) {
  if (!check(param)) throw '需要登录';
  let resp = await axios.get(domainurl+ 'plugin.php?id=dsu_paulsign:sign');
  if (/需要先登录/.test(resp.data)) throw '需要登录';
  if (/已经签到/.test(resp.data)) return '重复签到';
  let formhash = /name="formhash" value="([^"]+)/.exec(resp.data)[1];
  let resp1 = await axios.post(
    domainurl + 'plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1',
    `formhash=${formhash}&qdxq=kx`
  );
  let reward = /<div class="c">[\r\s\n]*(.*?)<[\/]?div/.exec(resp1.data);
  if (reward && /已经签到/.test(reward[1])) return '重复签到';
  if (reward && /签到成功/.test(reward[1])) return /恭喜你签到成功![\s]?(.*)/.exec(reward[1])[1];
  throw '签到失败';
};

let check = async function (param) {
  let resp = await axios.get(domainurl + 'home.php?mod=spacecp&ac=usergroup', {
    headers: { Referer: domainurl }
  });
  if (!/我的用户组/.test(resp.data)) {
    let formhash = /name="formhash" value="([\w]*)"/.exec(resp.data);
    let loginhash = /loginform_([\w]*)/.exec(resp.data);
    if (formhash) {
      console.log(`[info]: formhash: ${formhash[1]}`);
      formhash = formhash[1];
    } else formhash = '7e9a73fb';
    if (loginhash) {
      console.log(`[info]: loginhash: ${loginhash[1]}`);
      loginhash = loginhash[1];
    } else loginhash = 'LrXk2';
    let resp1 = await axios.post(
      domainurl +
        `member.php?mod=logging&action=login&loginsubmit=yes&handlekey=login&loginhash=${loginhash}&inajax=1`,
      {
        formhash: formhash,
        referer: domainurl,
        loginfield: 'username',
        username: param.name,
        cookietime: '2592000',
        password: param.pwd,
        questionid: '0',
        answer: '',
        handlekey: 'ls'
      },
      {
        transformRequest: [
          function (data) {
            let ret = '';
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
            }
            return ret.substring(0, ret.length - 1);
          }
        ],
        headers: {
          Origin: domainurl,
          Referer: domainurl + 'member.php?mod=logging&action=login',
          'upgrade-insecure-requests': 1
        }
      }
    );
    return /欢迎您回来/.test(resp1.data);
  } else return true;
};

module.exports = { run, check };