// ==UserScript==
// @name              聚创
// @namespace         https://soulsign.inu1255.cn/scripts/186
// @version           1.0.4
// @author            yi-Xu-0100
// @loginURL          https://www.scjuchuang.com/login/index
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/聚创
// @expire            900000
// @domain            www.scjuchuang.com
// @grant            cookie
// ==/UserScript==

/**
 * @file 聚创签到脚本
 * @author yi-Xu-0100
 * @version 1.0.4
 */

/**
 * @module 聚创签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.scjuchuang.com] - 请求的域名
 * @param {string|string[]} [grant = cookie] - 脚本需要的权限
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/186] - 脚本主页
 * @param {string} [loginURL = https://www.scjuchuang.com/login/index] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/聚创] - 脚本更新链接
 */

exports.run = async function (param) {
  var userinfo = await getCookie('https://www.scjuchuang.com/index', 'userinfo');
  var { data } = await axios.post(
    'https://www.scjuchuang.com/intergralSigin/signin',
    {
      user_id: JSON.parse(userinfo).user_id,
      token: JSON.parse(userinfo).token
    },
    {
      headers: {
        Origin: 'https://www.scjuchuang.com',
        Referer: 'https://www.scjuchuang.com/index'
      }
    }
  );
  if (/签到成功/.test(data.msg))
    return (
      '今日获得 ' + data.data.integral + ' 积分,已连续签到 ' + data.data.continue_count + ' 天'
    );
  if (/今日已签到/.test(data.msg)) return '重复签到';
  if (/长时间未操作,请重新登录/.test(data.msg)) {
    var { data } = await axios.get('https://www.scjuchuang.com/index');
    if (!/进入会员中心/.test(data)) throw '请登录';
    var { data } = await axios.get('https://www.scjuchuang.com/intergralSigin/index');
    return /已签到/.test(data) ? '重复签到.' : data;
  } else throw data;
};

exports.check = async function (param) {
  var { data } = await axios.get('https://www.scjuchuang.com/index');
  return /进入会员中心/.test(data) ? true : false;
};
