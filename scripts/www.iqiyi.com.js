// ==UserScript==
// @name              爱奇艺签到
// @namespace         https://soulsign.inu1255.cn/scripts/290
// @version           1.0.5
// @author            yi-Xu-0100
// @loginURL          https://www.iqiyi.com/u/accountset
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/爱奇艺签到
// @expire            900000
// @domain            www.iqiyi.com
// @domain            tc.vip.iqiyi.com
// @domain            community.iqiyi.com
// @grant             cookie
// ==/UserScript==

/**
 * @file 爱奇艺签到脚本
 * @author yi-Xu-0100
 * @version 1.0.5
 */

/**
 * @module 爱奇艺签到脚本
 * @description  本脚本借鉴 [NobyDa/Script](https://github.com/NobyDa/Script/blob/42e6e1978fed46f531666d0db096b67858592fda/iQIYI-DailyBonus/iQIYI.js)，需要 cookie 权限获取签到相关参数。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = [www.iqiyi.com, tc.vip.iqiyi.com, community.iqiyi.com]] - 请求的域名
 * @param {string|string[]} [grant = cookie] - 脚本需要的权限
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/290] - 脚本主页
 * @param {string} [loginURL = https://www.iqiyi.com/u/accountset] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/爱奇艺签到] - 脚本更新链接
 */

let run = async function (param) {
  if (!check(param)) throw '需要登录';
  var P00001 = await getCookie('https://www.iqiyi.com/', 'P00001');
  var userId = await getCookie('https://www.iqiyi.com/', 'P00003');
  var deviceID = await getCookie('https://www.iqiyi.com/', 'QY_PUSHMSG_ID');
  var dfp = /(.+?)@/.exec(await getCookie('https://www.iqiyi.com/', '__dfp'))[1];
  var resp = await axios.get(
    `https://tc.vip.iqiyi.com/taskCenter/task/queryUserTask?autoSign=yes&P00001=${P00001}`
  );
  var signInfo = resp.data.data.signInfo;
  if (signInfo.code === 'SIGNED') var message = 'VIP会员重复签到';
  else if (signInfo.code === 'A00000')
    for (let i = 0; i < signInfo.data.signRewardResponses.length; i++) {
      message =
        (message ? `${message}，` : '') +
        signInfo.data.signRewardResponses[i].name +
        signInfo.data.signRewardResponses[i].value;
    }
  else message = signInfo.msg;
  var resp1 = await axios.get(
    `https://tc.vip.iqiyi.com/taskCenter/task/joinTask?P00001=${P00001}&taskCode=b6e688905d4e7184&platform=b6c13e26323c537d&lang=zh_CN&app_lm=cn`
  );
  if (resp1.data.code === 'Q00504') message = message + '，浏览会员俱乐部重复完成';
  else if (resp1.data.code === 'A00000') {
    let resp = await axios.get(
      `https://tc.vip.iqiyi.com/taskCenter/task/getTaskRewards?P00001=${P00001}&taskCode=b6e688905d4e7184&dfp=${dfp}&platform=b6c13e26323c537d&lang=zh_CN&app_lm=cn&deviceID=${deviceID}&token=&multiReward=1&fv=bed99b2cf5722bfe`
    );
    if (resp.data.code === 'A00000')
      message = message + '，浏览会员俱乐部，成长值' + (resp.data.data[0]['成长值'] || '未知');
  } else message = message + '浏览会员俱乐部出错，' + resp.data.msg;
  var resp2 = await axios.get(
    `https://community.iqiyi.com/openApi/score/add?authCookie=${P00001}&userId=${userId}&channelCode=sign_pcw&agenttype=1&agentversion=0&appKey=basic_pca&appver=0&srcplatform=1&typeCode=point&verticalCode=iQIYI&scoreType=1&user_agent=Mozilla/5.0%20(Windows%20NT%2010.0;%20Win64;%20x64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/88.0.4298.0%20Safari/537.36%20Edg/88.0.685.3&dfp=${dfp}&sign=2f03d94fa65964342b5c698654ae0f50`
  );
  if (resp2.data.data && resp2.data.data[0].code === 'A0002')
    message = message + '，个人中心重复签到';
  else if (resp2.data.data && resp2.data.data[0].code === 'A0000')
    message = message + '，个人中心签到，积分+' + resp2.data.data[0].score;
  else message = message + ',个人中心签到出错，' + resp2.data.message;
  var resp3 = await axios.get(
    `https://community.iqiyi.com/openApi/task/complete?authCookie=${P00001}&userId=${userId}&channelCode=paopao_pcw&agenttype=1&agentversion=0&appKey=basic_pcw&appver=0&srcplatform=1&typeCode=point&verticalCode=iQIYI&scoreType=1&sign=d2a03e35a17fbef808146de25829b9a4&callback=cb`
  );
  var resp_data = JSON.parse(/cb\((\{[\s\S]*\})\)\}catch/.exec(resp3.data)[1]);
  if (resp_data.code === 'A0002') message = message + '，访问热点首页重复完成';
  else if (resp_data.code === 'A00000') {
    let resp = await axios.get(
      `https://community.iqiyi.com/openApi/score/getReward?authCookie=${P00001}&userId=${userId}&channelCode=paopao_pcw&agenttype=1&agentversion=0&appKey=basic_pcw&appver=0&srcplatform=1&typeCode=point&verticalCode=iQIYI&scoreType=1&user_agent=Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64)%20AppleWebKit%2F537.36%20(KHTML%2C%20like%20Gecko)%20Chrome%2F88.0.4298.0%20Safari%2F537.36%20Edg%2F88.0.685.3&dfp=${dfp}&sign=eeb255f0ca2cfbdf5573fd8ee22d7576&callback=cb`
    );
    let resp_data = JSON.parse(/cb\((\{[\s\S]*\})\)\}catch/.exec(resp.data)[1]);
    message = message + '，访问热点首页，积分+' + resp_data.data.score;
  } else message = message + '访问热点首页出错，' + resp_data.message;
  return message;
};

let check = async function (param) {
  return !!(await getCookie('https://www.iqiyi.com/', 'P00001'));
};

module.exports = { run, check };
