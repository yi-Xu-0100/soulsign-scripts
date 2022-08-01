// ==UserScript==
// @name              好书友签到
// @namespace         https://soulsign.inu1255.cn/scripts/185
// @version           1.1.2
// @author            yi-Xu-0100
// @loginURL          https://www.93hsy.com/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/好书友签到
// @expire            900000
// @domain            www.93hsy.com
// @param            name 账户
// @param            pwd 加密密码
// @param            timeout 设置true提示timeout错误，其余改为false
// @param            code468 设置true提示code468错误，其余改为false
// ==/UserScript==

/**
 * @file 好书友签到脚本
 * @author yi-Xu-0100
 * @author Vicrack
 * @version 1.1.2
 */

/**
 * @module 好书友签到脚本
 * @description 本脚本借鉴 [Vicrack 的鱼C论坛脚本](https://soulsign.inu1255.cn/scripts/167)，提供设置用户名和密码方式自动登陆，其中密码为真实密码的 MD5 加密后的密钥。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.93hsy.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/185] - 脚本主页
 * @param {string} [loginURL = https://www.93hsy.com/member.php?mod=logging&action=login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/好书友签到] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 加密密码
 * @param {boolean} timeout - 设置为true提示timeout错误，其余改为false
// @param {boolean} code468 - 设置true提示code468错误，其余改为false
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  let resp = await axios.get('https://www.93hsy.com/plugin.php?id=k_misign:sign', {
    headers: { 'upgrade-insecure-requests': 1 }
  });
  if (resp.data.includes('您的签到排名')) return '重复签到';
  let result = resp.data.match(/<a id="JD_sign" href="(.*?)"/);
  if (result[1] == 'member.php?mod=logging&action=login') throw '需要登录';
  let resp1 = await axios.get('https://www.93hsy.com/' + result[1]);
  if (/需要先登录/.test(resp1.data)) throw '需要登录';
  let resp2 = await axios.get('https://www.93hsy.com/plugin.php?id=k_misign:sign', {
    headers: { 'upgrade-insecure-requests': 1 }
  });
  if (resp2.data.includes('您的签到排名')) {
    let result = resp2.data.match(/id="lxreward" value="(.*?)"/);
    return '积分奖励: ' + result[1] + ' 银币';
  } else throw '未成功签到';
};

let check = async function (param) {
  try {
    let resp = await axios.get('https://www.93hsy.com/home.php?mod=spacecp&ac=usergroup');

    if (/<div class="title">You have verified successfully/.test(resp.data)) {
      let __CBK = /__CBK=([\w]*)/.exec(resp.data);
      if (__CBK) {
        console.log(`[info]: __CBK: ${__CBK[1]}`);
        __CBK = __CBK[1];
      } else throw Error('Not Found __CBK');
      resp = await axios.get(
        `https://www.93hsy.com/home.php?mod=spacecp&ac=usergroup&__CBK=${__CBK}`
      );
    }
    resp = await axios.get('https://www.93hsy.com/home.php?mod=spacecp&ac=usergroup');
    if (/我的用户组/.test(resp.data)) return true;
    else {
      let resp = await axios.get(
        'https://www.93hsy.com/member.php?mod=logging&action=login&infloat=yes&frommessage&inajax=1&ajaxtarget=messagelogin'
      );
      let formhash = /name="formhash" value="([\w]*)"/.exec(resp.data);
      let loginhash = /loginform_([\w]*)/.exec(resp.data);
      if (formhash) {
        console.log(`[info]: formhash: ${formhash[1]}`);
        formhash = formhash[1];
      } else formhash = '374e6cbe';
      if (loginhash) {
        console.log(`[info]: loginhash: ${loginhash[1]}`);
        loginhash = loginhash[1];
      } else loginhash = 'LeAAj';
      await axios.post(
        `https://www.93hsy.com/member.php?mod=logging&action=login&loginsubmit=yes&loginhash=${loginhash}&inajax=1`,
        {
          formhash: formhash,
          referer: 'https://www.93hsy.com/home.php?mod=spacecp&ac=usergroup',
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
            Origin: 'https://www.93hsy.com',
            Referer: 'https://www.93hsy.com/member.php?mod=logging&action=login',
            'upgrade-insecure-requests': 1
          }
        }
      );
      let resp1 = await axios.get('https://www.93hsy.com/home.php?mod=spacecp&ac=usergroup');
      return /我的用户组/.test(resp1.data);
    }
  } catch (e) {
    if (param.timeout === 'true') param.timeout = true;
    else param.timeout = false;
    if (param.code468 === 'true') param.code468 = true;
    else param.code468 = false;
    if (e.message === 'timeout of 10000ms exceeded' && !param.timeout) {
      console.log(`[info]: 好书友签到脚本检查在线状态超时`);
      return true;
    }
    if (e.message === 'Request failed with status code 468' && !param.code468) {
      console.log(`[info]: 好书友签到脚本检查在线状态失败，HTTP 响应码: 468`);
      return true;
    }
    console.log(e);
    console.log(e.message);
    console.log(e.code);
    throw e;
  }
};

module.exports = { run, check };
