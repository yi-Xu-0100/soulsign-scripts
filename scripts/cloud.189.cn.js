// ==UserScript==
// @name              cloud189签到
// @namespace         https://soulsign.inu1255.cn/scripts/604
// @version           1.0.3
// @author            yi-Xu-0100
// @loginURL          https://cloud.189.cn/web/login.html
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/cloud189签到
// @expire            900000
// @domain            cloud.189.cn
// @domain            open.e.189.cn
// @domain            m.cloud.189.cn
// @grant             require
// @param             name 账户
// @param             pwd 密码
// ==/UserScript==

/**
 * @file cloud189签到脚本
 * @author yi-Xu-0100
 * @author MayoBlueSky
 * @version 1.0.3
 */

/**
 * @module cloud189签到脚本
 * @description 本脚本借鉴 [MayoBlueSky 的 cloud189 签到脚本](https://github.com/MayoBlueSky/My-Actions/blob/master/function/cloud189/checkin.py)，需要请求 [jsencrypt](https://github.com/travist/jsencrypt) 完成账号密码登录。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = [cloud.189.cn,open.e.189.cn,m.cloud.189.cn]] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/604] - 脚本主页
 * @param {string} [loginURL = https://cloud.189.cn/web/login.html] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/cloud189签到脚本] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

let headers = {
  Referer: 'https://m.cloud.189.cn/zhuanti/2016/sign/index.jsp?albumBackupOpened=1',
  Host: 'm.cloud.189.cn',
  'Accept-Encoding': 'gzip, deflate'
};

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  let resp = await axios.get('https://m.cloud.189.cn/userSign.action', {
    headers: headers
  });
  let log = `签到获得 ${resp.data.netdiskBonus}M 空间，`;
  let resp1 = await axios.get(
    'https://m.cloud.189.cn/v2/drawPrizeMarketDetails.action?taskId=TASK_SIGNIN&activityId=ACT_SIGNIN',
    {
      headers: headers
    }
  );
  console.log(resp1.data);
  console.log(/User_Not_Chance/.test(resp1.data));
  if (/User_Not_Chance/.test(resp1.data.errorCode)) {
    log += '签到抽奖已完成，';
  } else if (resp1.data.prizeName) {
    log += `签到抽奖获得 ${resp1.data.match(/天翼云盘(.*?)空间/)[1]} 空间，`;
  } else throw resp1.data;
  let resp2 = await axios.get(
    'https://m.cloud.189.cn/v2/drawPrizeMarketDetails.action?taskId=TASK_SIGNIN_PHOTOS&activityId=ACT_SIGNIN',
    {
      headers: headers
    }
  );
  if (/User_Not_Chance/.test(resp2.data.errorCode)) {
    log += '相册抽奖已完成';
  } else if (resp2.data.prizeName) {
    log += `相册抽奖获得 ${resp2.data.match(/天翼云盘(.*?)空间/)[1]} 空间`;
  } else throw resp2.data;
  return log;
};

let check = async function (param) {
  let resp = await axios.get('https://m.cloud.189.cn/userSign.action', {
    headers: headers
  });
  if (resp.data.netdiskBonus) return true;
  else if (param.name && param.pwd) {
    let resp1 = await axios.get(
      'https://cloud.189.cn/api/portal/loginUrl.action?redirectURL=https://cloud.189.cn/web/redirect.html'
    );
    let captchaToken = resp1.data.match(/captchaToken' value='(.+?)'/);
    if (captchaToken == null) throw 'Not found captchaToken';
    let lt = resp1.data.match(/lt = "(.+?)"/);
    if (lt == null) throw 'Not found lt';
    let returnUrl = resp1.data.match(/returnUrl = '(.+?)'/);
    if (returnUrl == null) throw 'Not found returnUrl';
    let paramId = resp1.data.match(/paramId = "(.+?)"/);
    if (paramId == null) throw 'Not found paramId';
    let j_rsakey = resp1.data.match(/j_rsaKey" value="(\S+)"/);
    if (j_rsakey == null) throw 'Not found j_rsakey';
    rsa_key = `-----BEGIN PUBLIC KEY-----\\n${j_rsakey[1]}\\n-----END PUBLIC KEY-----`;
    let JSEncrypt =
      await require('https://cdn.jsdelivr.net/gh/travist/jsencrypt@master/bin/jsencrypt.min.js');
    const jse = new JSEncrypt();
    jse.setKey(j_rsakey[1]);
    let b64tohex = function (a) {
      let b64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        b64pad = '=',
        BI_RM = '0123456789abcdefghijklmnopqrstuvwxyz';
      let b,
        c,
        d = '',
        e = 0;
      let int2char = function (a) {
        return BI_RM.charAt(a);
      };
      for (b = 0; b < a.length && a.charAt(b) != b64pad; ++b)
        (v = b64map.indexOf(a.charAt(b))),
          v < 0 ||
            (e =
              0 == e
                ? ((d += int2char(v >> 2)), (c = 3 & v), 1)
                : 1 == e
                ? ((d += int2char((c << 2) | (v >> 4))), (c = 15 & v), 2)
                : 2 == e
                ? ((d += int2char(c)), (d += int2char(v >> 2)), (c = 3 & v), 3)
                : ((d += int2char((c << 2) | (v >> 4))), (d += int2char(15 & v)), 0));
      return 1 == e && (d += int2char(c << 2)), d;
    };
    let resp2 = await axios.post(
      'https://open.e.189.cn/api/logbox/oauth2/loginSubmit.do',
      {
        appKey: 'cloud',
        accountType: '01',
        userName: `{RSA}${b64tohex(jse.encrypt(param.name))}`,
        password: `{RSA}${b64tohex(jse.encrypt(param.pwd))}`,
        validateCode: '',
        captchaToken: captchaToken[1],
        returnUrl: returnUrl[1],
        mailSuffix: '@189.cn',
        paramId: paramId[1]
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
        ],
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:74.0) Gecko/20100101 Firefox/76.0',
          Referer: 'https://open.e.189.cn/',
          lt: lt[1]
        }
      }
    );
    if (/登录成功/.test(resp2.data.msg)) {
      await axios.get(resp2.data.toUrl);
      return true;
    } else return false;
  }
};

module.exports = { run, check };
