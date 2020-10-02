// ==UserScript==
// @name              鱼C论坛
// @namespace         https://soulsign.inu1255.cn?account=ViCrack
// @version           1.0.2
// @author            ViCrack
// @loginURL          https://fishc.com.cn
// @updateURL         https://soulsign.inu1255.cn/script/ViCrack/鱼C论坛
// @expire            900000
// @domain            fishc.com.cn
// ==/UserScript==

/**
 * @file 鱼C论坛签到脚本
 * @author ViCrack
 * @version 1.0.2
 */

/**
 * @module 鱼C论坛签到脚本
 * @description 本脚本是 [ViCrack](https://github.com/ViCrack) 所创造。
 * @param {string|string[]} [domain = fishc.com.cn] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/167] - 脚本主页
 * @param {string} [loginURL = https://fishc.com.cn] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/ViCrack/鱼C论坛] - 脚本更新链接
 */

exports.run = async function (param) {
  // 签到的页面
  let resp = await axios.get('https://fishc.com.cn/plugin.php?id=k_misign:sign');
  let signhtml = resp.data;
  if (signhtml.includes('您的签到排名')) {
    return '已经签到过';
  }
  let result = signhtml.match(/<a id="JD_sign" href="(.*?)"/);
  if (result == null) {
    throw '未登录';
  }
  let signurl = result[1];
  var { data } = await axios.get('https://fishc.com.cn/' + signurl);
  if (/今日已签/.test(data)) return '任务已完成';
  if (/需要先登录/.test(data)) throw '未登录';
  let resp1 = await axios.get('https://fishc.com.cn/plugin.php?id=k_misign:sign');
  let signhtml1 = resp1.data;
  if (signhtml1.includes('您的签到排名')) {
    let result1 = signhtml1.match(
      /<input type="hidden" class="hidnum" id="lxreward" value="(.*?)"/
    );
    return '积分奖励: ' + result1[1] + ' 鱼币';
  } else throw '未成功签到';
};

exports.check = async function (param) {
  var { status, data } = await axios.get('https://fishc.com.cn/home.php?mod=spacecp&ac=usergroup', {
    maxRedirects: 0
  });
  if (/需要先登录/.test(data)) return false;
  return true;
};
