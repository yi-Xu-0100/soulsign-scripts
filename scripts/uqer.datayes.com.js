// ==UserScript==
// @name              优矿
// @namespace         https://soulsign.inu1255.cn/scripts/268
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://uqer.datayes.com/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/优矿
// @expire            900000
// @domain            gw.datayes.com
// ==/UserScript==

/**
 * @file 优矿签到脚本
 * @author yi-Xu-0100
 * @version 1.0.1
 */

/**
 * @module 优矿签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = gw.datayes.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/268] - 脚本主页
 * @param {string} [loginURL = https://uqer.datayes.com/login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/优矿] - 脚本更新链接
 */

exports.run = async function (param) {
  var resp = await axios.get('https://gw.datayes.com/mercury_community/profile');
  if (resp.data.message === 'Need login') throw '需要登录';
  var user_id = resp.data.data.user_id;
  var resp1 = await axios.get('https://gw.datayes.com/mercury_community/popwindow?type=sign');
  if (resp1.data.data.is_pop === false) return '重复签到';
  var resp2 = await axios.get(
    `https://gw.datayes.com/mercury_community/user/${user_id}?field=point_stats`
  );
  var originPoints = resp2.data.data.point_stats.available_points;
  var resp3 = await axios.post(
    'https://gw.datayes.com/mercury_community/popwindow',
    { is_pop: false, type: 'sign' },
    {
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      }
    }
  );
  if (resp3.data.code != 200) throw resp3.data;
  var resp4 = await axios.get(
    `https://gw.datayes.com/mercury_community/user/${user_id}?field=point_stats`
  );
  var todayPoints = resp4.data.data.point_stats.available_points;
  return `获得 ${todayPoints - originPoints} 积分`;
};

exports.check = async function (param) {
  var resp = await axios.get('https://gw.datayes.com/mercury_community/profile');
  return resp.data.message != 'Need login';
};
