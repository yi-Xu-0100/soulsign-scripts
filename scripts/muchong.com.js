// ==UserScript==
// @name              小木虫签到
// @namespace         https://soulsign.inu1255.cn/scripts/537
// @version           1.1.1
// @author            yi-Xu-0100
// @loginURL          http://muchong.com/bbs/logging.php?action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/小木虫签到
// @expire            900000
// @domain            muchong.com
// @param             name 账户
// @param             pwd 密码
// ==/UserScript==

/**
 * @file 小木虫签到脚本
 * @author yi-Xu-0100
 * @version 1.1.1
 */

/**
 * @module 小木虫签到脚本
 * @description 本脚本参考 [andyyelu/muchong_checkin](https://github.com/andyyelu/muchong_checkin) 提供设置用户名和密码方式自动登陆。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = muchong.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/537] - 脚本主页
 * @param {string} [loginURL = http://muchong.com/bbs/logging.php?action=login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/小木虫签到] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 密码
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录';
  let resp = await axios.get('http://muchong.com/bbs/memcp.php?action=getcredit');
  if (/您已经领取今天的红包啦/.test(resp.data)) return '重复签到';
  let formhash = /name="formhash" value="([^"]+)/.exec(resp.data);
  if (formhash == null) throw 'Not found formhash';
  let resp1 = await axios.post(
    'http://muchong.com/bbs/memcp.php?action=getcredit',
    `getmode=1&creditsubmit=1&formhash=${formhash[1]}`
  );
  let coin = />(\d+?)<\/span>[\s\n\r]+?个金币大礼包！/.exec(resp1.data);
  if (coin) return `获得 ${coin[1]} 个金币`;
  else throw 'Not found coin';
};

let check = async function (param) {
  let resp = await axios.get('http://muchong.com/bbs/memcp.php?action=getcredit');
  if (/您还没有登录/.test(resp.data)) {
    if (!param.name || !param.pwd) return false;
    let resp1 = await axios.get('http://muchong.com/bbs/logging.php?action=login');
    let checkStatus = /您所在的IP段有用户试图多次尝试获取帐号情况/.exec(resp1.data);
    if (checkStatus != null) throw 'IP 段被封，请自行尝试邮箱登录';
    let formhash = /name="formhash" value="([^"]+)/.exec(resp1.data);
    if (formhash == null) throw 'Not found formhash';
    let loginTime = /t=(\d+)/.exec(resp1.data);
    if (loginTime == null) throw 'Not found formhash';
    let resp2 = await axios.post(
      `http://muchong.com/bbs/logging.php?action=login&t=${loginTime[1]}`,
      `formhash=${formhash[1]}&username=${param.name}&password=${encodeURIComponent(param.pwd)}` +
        '&cookietime=31536000&rule=rule&refer=&loginsubmit=%BB%E1%D4%B1%B5%C7%C2%BC'
    );
    let checkStatus1 = /您所在的IP段有用户试图多次尝试获取帐号情况/.exec(resp2.data);
    if (checkStatus1 != null) throw 'IP 段被封，请自行尝试邮箱登录';
    let question = /问题：(\d+)(\D+)(\d+)等于多少/.exec(resp2.data);
    if (question == null) throw 'Not found question';
    let answer = question[1] / question[3];
    if (question[2] === '加') answer = question[1] * 1 + question[3] * 1;
    if (question[2] === '减') answer = question[1] - question[3];
    if (question[2] === '乘以') answer = question[1] * question[3];
    let formhash1 = /name="post_sec_hash" value="([^"]+)/.exec(resp2.data);
    if (formhash1 == null) throw 'Not found post_sec_hash';
    let resp3 = await axios.post(
      `http://muchong.com/bbs/logging.php?action=login&t=${loginTime[1]}`,
      `formhash=${formhash[1]}&post_sec_code=${answer}&post_sec_hash=${formhash1[1]}` +
        `&username=${param.name}&loginsubmit=%CC%E1%BD%BB`
    );
    let checkStatus2 = /您所在的IP段有用户试图多次尝试获取帐号情况/.exec(resp3.data);
    if (checkStatus2 != null) throw 'IP 段被封，请自行尝试邮箱登录';
    let checkStatus3 = /输入的帐号密码错误/.exec(resp4.data);
    if (checkStatus3 != null) throw '输入的帐号密码错误';
    return true;
  } else return true;
};

module.exports = { run, check };
