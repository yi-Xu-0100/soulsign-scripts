// ==UserScript==
// @name              sketchupbar
// @namespace         https://soulsign.inu1255.cn/scripts/192
// @version           1.0.2
// @author            yi-Xu-0100
// @loginURL          https://www.sketchupbar.com/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/sketchupbar
// @expire            900000
// @domain            www.sketchupbar.com
// ==/UserScript==

exports.run = async function(param) {
// 签到的页面
    let resp = await axios.get("https://www.sketchupbar.com/sign.php?mod=sign");
    let signhtml = resp.data;
    let originhbs=signhtml.match(/<span>(.*?)<\/span>\s+<span id="hbs_info"/);
    let originbb=signhtml.match(/<span>(.*?)<\/span>\s+<span id="bb_info"/);
    if (signhtml.includes("您的签到排名")){
        return "重复签到";
    }
    let result = signhtml.match(/<a id="JD_sign" class="BtBox" href="(.*?)"/);
    if (result == null) {
        throw "未登录";
    }
    let signurl = result[1];
    var {
        data
    } = await axios.get(
        "https://www.sketchupbar.com/" + signurl
    );
    let resp1 = await axios.get("https://www.sketchupbar.com/sign.php?mod=sign");
    let signhtml1 = resp1.data;
    let rewards = "今日获得：";
    if (signhtml1.includes("您的签到排名")){
        todayhbs=signhtml1.match(/<span>(.*?)<\/span>\s+<span id="hbs_info"/);
        todaybb=signhtml1.match(/<span>(.*?)<\/span>\s+<span id="bb_info"/);
        let hbs=todayhbs[1] - originhbs[1];
        if(hbs) rewards = rewards + hbs + " 红宝石，";
        let bb=todaybb[1] - originbb[1];
        if(bb) rewards = rewards + bb + " 吧币，";
        let resp2 = await axios.post("https://www.sketchupbar.com/plugin.php?id=k_misign:get_zhuanpan");
        
        while(/200/.test(resp2.data.code)){
            rewards = rewards + resp2.data.name;
        }
        return rewards;
    }
    else throw "未成功签到";
};

exports.check = async function(param) {
var {
        status,
        data,
    } = await axios.get(
        "https://www.sketchupbar.com/home.php?mod=spacecp&ac=usergroup", {
            maxRedirects: 0
        }
    );
    if (/需要先登录/.test(data)) return false;
    return true;
};