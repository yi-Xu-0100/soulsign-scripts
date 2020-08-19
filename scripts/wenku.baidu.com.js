// ==UserScript==
// @name              百度文库签到
// @namespace         https://soulsign.inu1255.cn/scripts/239
// @version           1.0.3
// @author            yi-Xu-0100
// @loginURL          https://passport.baidu.com/v2/?login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/百度文库签到
// @expire            900000
// @domain            wenku.baidu.com
// ==/UserScript==

/**
 * @file 百度文库签到脚本
 * @author yi-Xu-0100
 * @author inu1255
 * @version 1.0.3
 */

/**
 * @module 百度文库签到脚本
 * @expire 15 分钟
 * @domain wenku.baidu.com
 * @description 本脚本借鉴 [inu1255 的百度文库签到脚本](https://soulsign.inu1255.cn/scripts/15)，更改了检查在线逻辑。
 *              脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 *              签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 */

exports.run = async function (param) {
    var { data } = await axios.get("https://wenku.baidu.com/task/submit/signin", {
        headers: {
            "Referer": "https://wenku.baidu.com/task/browse/daily"
        }
    });
    if (data.errno === "0") return "成功签到";
    if (data.errno === "109") throw "需要登录";
    throw JSON.stringify(data);
};

exports.check = async function (param) {
    var { data } = await axios.get("https://wenku.baidu.com/task/browse/daily");
    return !(/登录百度帐号/.test(data));
}