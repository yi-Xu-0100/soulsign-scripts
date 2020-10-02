// ==UserScript==
// @name              好书友签到
// @namespace         https://soulsign.inu1255.cn/scripts/185
// @version           1.0.7
// @author            yi-Xu-0100
// @loginURL          http://www.93book.com/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/好书友签到
// @expire            900000
// @domain            www.93book.com
// @param            name 账户
// @param            pwd 加密密码
// ==/UserScript==

/**
 * @file 好书友签到脚本
 * @author yi-Xu-0100
 * @author Vicrack
 * @version 1.0.7
 */

/**
 * @module 好书友签到脚本
 * @description 本脚本借鉴 [Vicrack 的鱼C论坛脚本](https://soulsign.inu1255.cn/scripts/167)，提供设置用户名和密码方式自动登陆，其中密码为真实密码的 MD5 加密后的密钥。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.93book.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/185] - 脚本主页
 * @param {string} [loginURL = http://www.93book.com/member.php?mod=logging&action=login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/好书友签到] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 加密密码
 */

exports.run = async function (param) {
  let resp = await axios.get('http://www.93book.com/plugin.php?id=k_misign:sign');
  let signhtml = resp.data;
  if (signhtml.includes('您的签到排名')) return '重复签到';
  let result = signhtml.match(/<a id="JD_sign" href="(.*?)"/);
  if (result[1] == 'member.php?mod=logging&action=login') throw '未登录';
  var { data } = await axios.get('http://www.93book.com/' + result[1]);
  if (/需要先登录/.test(data)) throw '未登录';
  let resp1 = await axios.get('http://www.93book.com/plugin.php?id=k_misign:sign');
  let signhtml1 = resp1.data;
  if (signhtml1.includes('您的签到排名')) {
    let result1 = signhtml1.match(
      /<input type="hidden" class="hidnum" id="lxreward" value="(.*?)"/
    );
    return '积分奖励: ' + result1[1] + ' 银币';
  } else throw '未成功签到';
};

exports.check = async function (param) {
  var { data } = await axios.get('http://www.93book.com/home.php?mod=spacecp&ac=usergroup', {
    maxRedirects: 0
  });
  if (/我的用户组/.test(data)) return true;
  else {
    var data = await axios.post(
      'http://www.93book.com/member.php?mod=logging&action=login&loginsubmit=yes&infloat=yes&lssubmit=yes&inajax=1',
      {
        fastloginfield: 'username',
        username: param.name,
        cookietime: '2592000',
        password: param.pwd,
        quickforward: 'yes',
        handlekey: 'ls'
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
          Origin: 'http://www.93book.com',
          'Upgrade-Insecure-Requests': '1',
          Referer: 'http://www.93book.com/home.php?mod=spacecp&ac=usergroup'
        }
      }
    );
    var { data } = await axios.get('http://www.93book.com/home.php?mod=spacecp&ac=usergroup', {
      maxRedirects: 0
    });
    if (/我的用户组/.test(data)) return true;
    else return false;
  }
};
