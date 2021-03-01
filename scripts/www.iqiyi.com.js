// ==UserScript==
// @name              爱奇艺签到
// @namespace         https://soulsign.inu1255.cn/scripts/290
// @version           1.0.9
// @author            yi-Xu-0100
// @loginURL          https://www.iqiyi.com/u/accountset
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/爱奇艺签到
// @expire            900000
// @domain            www.iqiyi.com
// @domain            tc.vip.iqiyi.com
// @domain            iface2.iqiyi.com
// @grant             cookie
// @param             VIP_EXPIRED_INFO 设置为false取消VIP过期错误提示
// ==/UserScript==

/**
 * @file 爱奇艺签到脚本
 * @author yi-Xu-0100
 * @version 1.0.9
 */

/**
 * @module 爱奇艺签到脚本
 * @description  本脚本借鉴 [NobyDa/Script](https://github.com/NobyDa/Script/blob/42e6e1978fed46f531666d0db096b67858592fda/iQIYI-DailyBonus/iQIYI.js)，需要 cookie 权限获取签到相关参数。
 *
 * 仅完成 VIP 签到、 VIP 浏览会员俱乐部任务和抽奖活动。
 *
 * 抽奖活动无需 VIP，默认以错误提示 VIP 过期，可设置参数 VIP_EXPIRED 为 false 取消错误提示。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = [www.iqiyi.com, tc.vip.iqiyi.com, iface2.iqiyi.com]] - 请求的域名
 * @param {string|string[]} [grant = cookie] - 脚本需要的权限
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/290] - 脚本主页
 * @param {string} [loginURL = https://www.iqiyi.com/u/accountset] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/爱奇艺签到] - 脚本更新链接
 * @param {string} VIP_EXPIRED_INFO - 设置为false取消VIP过期错误提示
 */

let run = async function (param) {
  if (!check(param)) throw '需要登录';
  const P00001 = await getCookie('https://www.iqiyi.com/', 'P00001');
  const deviceID = await getCookie('https://www.iqiyi.com/', 'QY_PUSHMSG_ID');
  const dfp = /(.+?)@/.exec(await getCookie('https://www.iqiyi.com/', '__dfp'))[1];
  var resp = await axios.get(
    `https://tc.vip.iqiyi.com/taskCenter/task/queryUserTask?autoSign=yes&P00001=${P00001}`
  );
  var signInfo = resp.data.data.signInfo;
  if (signInfo.code === 'SIGNED') var message = 'VIP会员重复签到；';
  else if (signInfo.code === 'FREE_VIP') message = '非付费会员；';
  else if (signInfo.code === 'VIP_EXPIRED') message = '用户VIP过期；';
  else if (signInfo.code === 'A00000') {
    for (let i = 0; i < signInfo.data.signRewardResponses.length; i++) {
      message =
        ((message && `${message}，`) || '') +
        signInfo.data.signRewardResponses[i].name +
        signInfo.data.signRewardResponses[i].value;
    }
    message = message + '；';
  } else message = `VIP会员签到出错，${signInfo.msg}；`;
  var resp1 = await axios.get(
    `https://tc.vip.iqiyi.com/taskCenter/task/joinTask?P00001=${P00001}&taskCode=b6e688905d4e7184&platform=b6c13e26323c537d&lang=zh_CN&app_lm=cn`
  );
  if (resp1.data.code === 'Q00504') message = message + '浏览会员俱乐部重复完成；';
  else if (resp1.data.code === 'Q00502') message = message + '不符合浏览会员俱乐部参与条件；';
  else if (resp1.data.code === 'A00000') {
    let resp = await axios.get(
      `https://tc.vip.iqiyi.com/taskCenter/task/getTaskRewards?P00001=${P00001}&taskCode=b6e688905d4e7184&dfp=${dfp}&platform=b6c13e26323c537d&lang=zh_CN&app_lm=cn&deviceID=${deviceID}&token=&multiReward=1&fv=bed99b2cf5722bfe`
    );
    if (resp.data.code === 'A00000')
      message =
        message +
        '浏览会员俱乐部，成长值' +
        ((resp.data.data[0] && resp.data.data[0]['成长值']) || '未知') +
        '；';
    else message = message + '浏览会员俱乐部出错，' + resp.data.msg + '；';
  } else message = message + '浏览会员俱乐部出错，' + resp1.data.msg + '；';
  for (let i = 0; i < 4; i++) {
    let resp = await axios.get(
      `https://iface2.iqiyi.com/aggregate/3.0/lottery_activity?app_k=0&app_v=0&platform_id=0&dev_os=0&dev_ua=0&net_sts=0&qyid=0&psp_uid=0&psp_cki=${P00001}&psp_status=0&secure_p=0&secure_v=0&req_sn=0`
    );
    if (resp.data.daysurpluschance != 0 || !resp.data.kv.msg)
      message = message + `${resp.data.awardName.replace(/《.+》/, '未中奖')}，`;
    else if (/明日再来吧/.test(resp.data.kv.msg)) {
      message = message.slice(0, -1) + (i === 0 ? '；重复抽奖' : '');
      break;
    } else message = message + `抽奖出错，${resp.data}`;
  }
  if (/出错/.test(message) || (param.VIP_EXPIRED_INFO != 'false' && /用户VIP过期/.test(message)))
    throw '[ERROR]: ' + message;
  else return message;
};

let check = async function (param) {
  return !!(await getCookie('https://www.iqiyi.com/', 'P00001'));
};

module.exports = { run, check };
