// ==UserScript==
// @name              盛天网络
// @namespace         https://soulsign.inu1255.cn/scripts/252
// @version           1.0.3
// @author            yi-Xu-0100
// @loginURL          https://register.stnts.com/new/v2/login.do
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/盛天网络
// @expire            900000
// @domain            register.stnts.com
// ==/UserScript==

/**
 * @file 盛天网络签到脚本
 * @author yi-Xu-0100
 * @version 1.0.3
 */

/**
 * @module 盛天网络签到脚本
 * @description 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 * 
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = register.stnts.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/252] - 脚本主页
 * @param {string} [loginURL = https://register.stnts.com/new/v2/login.do] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/盛天网络] - 脚本更新链接
 */

exports.run = async function (param) {
    var resp = await axios.get("https://register.stnts.com/new/v2/account/home.do");
    if (/用户中心-登录页/.test(resp.data)) throw "需要登录";
    var resp1 = await axios.get("https://register.stnts.com/new/account/signin.do");
    if (resp1.data.info === "今日已签到") return "重复签到";
    if (resp1.data.info === "签到成功") {
        var reward = (resp1.data.data.continueNum - 1) * 3 + 5;
        return '签到获得 ' + (((reward < 20) && reward) || 20) + " 积分";
    }
    throw resp1.data;

};

exports.check = async function (param) {
    var resp = await axios.get("https://register.stnts.com/new/v2/account/home.do");
    if (/用户中心-登录页/.test(resp.data)) {
        return open("https://register.stnts.com/new/v2/login.do", false, async (fb) => {
            if (await fb.click(".btn.btn-blue.btn-max.mt30.js-auto-submit-btn")) {
                await fb.waitLoaded();
                return true;
            } else return false;
        });
    } else return true;
};
