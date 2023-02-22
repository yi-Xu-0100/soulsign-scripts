// ==UserScript==
// @name              阿里云盘签到
// @namespace         https://soulsign.inu1255.cn/scripts/706
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://www.aliyundrive.com/sign/in
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/阿里云盘签到
// @expire            900000
// @domain            www.aliyundrive.com
// @domain            auth.aliyundrive.com
// @domain            member.aliyundrive.com
// @param             refresh_token refresh_token
// ==/UserScript==

/**
 * @file 阿里云盘签到脚本
 * @author yi-Xu-0100
 * @author Anonym-w
 * @author mrabit
 * @version 1.0.1
 */

/**
 * @module 阿里云盘签到脚本
 * @description 本脚本借鉴 [Anonym-w 的 autoSigninAliyun](https://github.com/Anonym-w/autoSigninAliyun/blob/main/autoSignin.js) 和 [mrabit 的 aliyundriveDailyCheck](https://github.com/mrabit/aliyundriveDailyCheck)，需要登录网页版阿里云盘，进入 F12 控制台，使用 `JSON.parse(localStorage.token).refresh_token` 获取 `refresh_token` 。
 *
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = [www.aliyundrive.com, auth.aliyundrive.com, member.aliyundrive.com]] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/706] - 脚本主页
 * @param {string} [loginURL = https://www.aliyundrive.com/sign/in] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/阿里云盘签到脚本] - 脚本更新链接
 * @param {string} refresh_token - refresh_token
 */

let run = async function (param) {
  if (!(await check(param))) throw '需要登录并更新 refresh_token';
  try {
    const resp1 = await axios.post(
      'https://auth.aliyundrive.com/v2/account/token',
      {
        grant_type: 'refresh_token',
        refresh_token: param.refresh_token
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const access_token = resp1.data.access_token;

    const resp2 = await axios.post(
      'https://member.aliyundrive.com/v1/activity/sign_in_list',
      {
        grant_type: 'refresh_token',
        refresh_token: param.refresh_token
      },
      {
        headers: {
          Authorization: 'Bearer ' + access_token,
          'Content-Type': 'application/json'
        }
      }
    );
    const signInCount = resp2.data.result.signInCount;
    let signInMessage = `本月签到${signInCount}天`;
    const signInReward = resp2.data.result.signInLogs[signInCount - 1].reward;
    if (signInReward) {
      signInMessage = signInMessage + `,本次签到获得${signInReward.name},${signInReward.description}`;
    }
    return signInMessage;
  } catch (error) {
    throw error;
  }
};

let check = async function (param) {
  try {
    await axios.post(
      'https://auth.aliyundrive.com/v2/account/token',
      {
        grant_type: 'refresh_token',
        refresh_token: param.refresh_token
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return true;
  } catch (error) {
    console.log('更新 access_token 失败');
    console.error(error);
    return false;
  }
};

module.exports = { run, check };
