// ==UserScript==
// @name              百度文库签到
// @namespace         https://soulsign.inu1255.cn/scripts/239
// @version           1.0.6
// @author            yi-Xu-0100
// @loginURL          https://wenku.baidu.com/
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/百度文库签到
// @expire            900000
// @domain            wenku.baidu.com
// ==/UserScript==

/**
 * @file 百度文库签到脚本
 * @author yi-Xu-0100
 * @author inu1255
 * @version 1.0.6
 */

/**
 * @module 百度文库签到脚本
 * @description 本脚本借鉴 [inu1255 的百度文库签到脚本](https://soulsign.inu1255.cn/scripts/15)，更改了检查在线逻辑，登录链接，检查了需要验证码时的情况，更新了返回的签到奖励消息。
 *
 * 普通用户文库签到任务已被改版取消！脚本将直接返回警告，如果有百度文库任务相关信息，请在 [issue#11](https://github.com/yi-Xu-0100/soulsign-scripts/issues/11) 下留言
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = wenku.baidu.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/239] - 脚本主页
 * @param {string} [loginURL = https://wenku.baidu.com/] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/百度文库签到] - 脚本更新链接
 */

let oldRun = async function (param) {
  var resp0 = await axios.get('https://wenku.baidu.com/task/browse/daily');
  if (/登录百度帐号/.test(resp0.data)) throw '需要登录';
  if (/<li class="today js-signin-btn g-ico g-ico-arrive">/.test(resp0.data)) return '重复签到';
  var rewards =
    '经验值 +' + JSON.parse(resp0.data.match('daily:({.*})')[1].toString()).today_exp_prize;
  var resp1 = await axios.get('https://wenku.baidu.com/user/interface/getuserasset2019', {
    headers: {
      Referer: 'https://wenku.baidu.com/nduc/browse/uc?_page=home&_redirect=1'
    }
  });
  var originWealth = resp1.data.data.wealth_show;
  var originTicket = resp1.data.data.totalTicket_show;
  var { data } = await axios.get('https://wenku.baidu.com/task/submit/signin', {
    headers: {
      Referer: 'https://wenku.baidu.com/task/browse/daily'
    }
  });
  if (data.errno === '0') {
    var resp2 = await axios.get('https://wenku.baidu.com/user/interface/getuserasset2019', {
      headers: {
        Referer: 'https://wenku.baidu.com/nduc/browse/uc?_page=home&_redirect=1'
      }
    });
    var todayWealth = resp2.data.data.wealth_show;
    if (todayWealth - originWealth) rewards += `，获得 ${todayWealth - originWealth} 积分`;
    var todayTicket = resp2.data.data.totalTicket_show;
    if (todayTicket - originTicket) rewards += `，获得 ${todayTicket - originTicket} 下载券`;
    return rewards;
  }
  if (data.errno === '109') throw '需要登录';
  if (data.errno === '1') throw '需要自行验证签到，请点击脚本名';
  throw data;
};

let oldCheck = async function (param) {
  var { data } = await axios.get('https://wenku.baidu.com/task/browse/daily');
  return !/登录百度帐号/.test(data);
};

let run = async function (param) {
  throw '普通用户文库签到任务已被改版取消！';
};

let check = async function (param) {
  return false;
};

module.exports = { run, check };
