// ==UserScript==
// @name              GORPG
// @namespace         https://soulsign.inu1255.cn/scripts/192
// @version           1.0.0
// @author            yi-Xu-0100
// @loginURL          https://www.gorpg.club/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/GORPG
// @expire            900000
// @domain            www.gorpg.club
// ==/UserScript==

exports.run = async function (param) {
    // 签到的页面
    let resp = await axios.get("https://www.gorpg.club/plugin.php?id=k_misign:sign");
    let signhtml = resp.data;
    if (signhtml.includes("您的签到排名")) {
        return "已经签到过";
    }
    let result = signhtml.match(/<a id="JD_sign" href="(.*?)"/);
    if (result == null) {
        throw "未登录";
    }
    let signurl = result[1];
    var {
        data
    } = await axios.get(
        "https://www.gorpg.club/" + signurl
    );
    if (/今日已签/.test(data)) return "任务已完成";
    if (/需要先登录/.test(data)) throw "未登录";
    let resp1 = await axios.get("https://www.gorpg.club/plugin.php?id=k_misign:sign");
    let signhtml1 = resp1.data;
    if (signhtml1.includes("您的签到排名")) {
        let result1 = signhtml1.match(/<input type="hidden" class="hidnum" id="lxreward" value="(.*?)"/);
        return "积分奖励: " + result1[1] + " 秘石";
    }
    else throw "未成功签到";
};

exports.check = async function (param) {
    var {
        status,
        data,
    } = await axios.get(
        "https://www.gorpg.club/home.php?mod=spacecp&ac=usergroup", {
        maxRedirects: 0
    }
    );
    if (/需要先登录/.test(data)) return false;
    return true;
};