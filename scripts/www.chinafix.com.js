// ==UserScript==
// @name              迅维网
// @namespace         https://soulsign.inu1255.cn/scripts/238
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://www.chinafix.com/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/迅维网
// @expire            900000
// @domain            www.chinafix.com
// ==/UserScript==

exports.run = async function (param) {
    let resp = await axios.get("https://www.chinafix.com/plugin.php?id=k_misign:sign");
    if (resp.data.includes("您的签到排名")) return "已经签到过";
    let result = resp.data.match(/<a id="JD_sign" href="(.*?)"/);
    if (result == null) throw "未登录";
    resp = await axios.get("https://www.chinafix.com/" + result[1]);
    if (/您所在用户组不允许使用/.test(resp.data)) throw "您所在用户组不允许使用";
    if (/今日已签/.test(resp.data)) return "重复签到";
    if (/需要先登录/.test(resp.data)) throw "未登录";
    resp = await axios.get("https://www.chinafix.com/plugin.php?id=k_misign:sign");
    if (resp.data.includes("您的签到排名")) {
        let result1 = resp.data.match(/<input type="hidden" class="hidnum" id="lxreward" value="(.*?)"/);
        return "积分奖励: " + result1[1] + " 下载分";
    } else throw "未成功签到";
};

exports.check = async function (param) {
    let resp = await axios.get("https://www.chinafix.com/home.php?mod=spacecp&ac=usergroup");
    return !(/需要先登录/.test(resp.data));
};