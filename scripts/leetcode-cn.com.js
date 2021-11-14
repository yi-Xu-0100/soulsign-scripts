// ==UserScript==
// @name              力扣中国
// @namespace         https://soulsign.inu1255.cn/scripts/191
// @version           1.0.3
// @author            yi-Xu-0100
// @loginURL          https://leetcode-cn.com/
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/力扣中国
// @expire            900000
// @domain            leetcode-cn.com
// ==/UserScript==

/**
 * @file 力扣中国签到脚本
 * @author yi-Xu-0100
 * @version 1.0.3
 */

/**
 * @module 力扣中国签到脚本
 * @description  脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = leetcode-cn.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/192] - 脚本主页
 * @param {string} [loginURL = https://leetcode-cn.com/] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/力扣中国] - 脚本更新链接
 */

let run = async function (param) {
  let defaultHeaders = {
    Origin: 'https://leetcode-cn.com/',
    Referer: 'https://leetcode-cn.com/points/'
  };
  let resp1 = await axios.post(
    'https://leetcode-cn.com/graphql/',
    {
      operationName: 'globalData',
      variables: {},
      query:
        'query globalData {\n  feature {\n    questionTranslation\n    subscription\n    signUp\n    discuss\n    mockInterview\n    contest\n    store\n    book\n    chinaProblemDiscuss\n    socialProviders\n    studentFooter\n    cnJobs\n    enableLsp\n    enableWs\n    enableDebugger\n    enableDebuggerAdmin\n    enableDarkMode\n    tasks\n    __typename\n  }\n  userStatus {\n    isSignedIn\n    isAdmin\n    isStaff\n    isSuperuser\n    isTranslator\n    isPremium\n    isVerified\n    isPhoneVerified\n    isWechatVerified\n    checkedInToday\n    username\n    realName\n    userSlug\n    groups\n    avatar\n    optedIn\n    requestRegion\n    region\n    activeSessionId\n    permissions\n    notificationStatus {\n      lastModified\n      numUnread\n      __typename\n    }\n    completedFeatureGuides\n    useTranslation\n    accountStatus {\n      isFrozen\n      inactiveAfter\n      __typename\n    }\n    __typename\n  }\n  siteRegion\n  chinaHost\n  websocketUrl\n  userBannedInfo {\n    bannedData {\n      endAt\n      bannedType\n      __typename\n    }\n    __typename\n  }\n}\n'
    },
    {
      headers: defaultHeaders
    }
  );
  if (!resp1.data.data.userStatus.isSignedIn) throw '没有登录';
  if (resp1.data.data.userStatus.checkedInToday) return '重复签到';
  let resp2 = await axios.get('https://leetcode-cn.com/points/api/total/', {
    headers: defaultHeaders
  });
  let originPoints = resp2.data.points;
  await axios.post(
    'https://leetcode-cn.com/graphql/',
    {
      operationName: 'checkin',
      variables: {},
      query:
        'mutation checkin {\n  checkin {\n    checkedIn\n    ok\n    error\n    __typename\n  }\n}\n'
    },
    {
      headers: defaultHeaders
    }
  );
  let resp3 = await axios.get('https://leetcode-cn.com/points/api/total/', {
    headers: defaultHeaders
  });
  let getPoints = resp3.data.points - originPoints;
  if (getPoints > 0) return '今日获得 ' + getPoints + ' 积分';
  else if (getPoints === 0) return '重复签到';
  throw resp3.data;
};

let check = async function (param) {
  let resp = await axios.get('https://leetcode-cn.com/explore/');
  return /isSignedIn: true/.test(resp.data);
};

module.exports = { run, check };
