// ==UserScript==
// @name              阅次元签到
// @namespace         https://soulsign.inu1255.cn/scripts/174
// @version           1.0.5
// @author            yi-Xu-0100
// @loginURL          https://www.abooky.com/member.php?mod=logging&action=login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/阅次元签到
// @expire            1200000
// @domain            www.abooky.com
// @param            name 账户
// @param            pwd 密码
// ==/UserScript==

exports.run = async function(param) {
let resp = await axios.get("https://www.abooky.com/plugin.php?id=k_misign:sign");
    let signhtml = resp.data;
    if (signhtml.includes("您的签到排名"))
        return "重复签到";
    let result = signhtml.match(/<a id="JD_sign" href="(.*?)"/);
    if (result[1] == "member.php?mod=logging&action=login") throw "未登录";
    var { data } = await axios.get("https://www.abooky.com/" + result[1]);
    if (/需要先登录/.test(data)) throw "未登录";
    let resp1 = await axios.get("https://www.abooky.com/plugin.php?id=k_misign:sign");
    let signhtml1 = resp1.data;
    if (signhtml1.includes("您的签到排名")){
        let result1 = signhtml1.match(/<input type="hidden" class="hidnum" id="lxreward" value="(.*?)"/);
        return "积分奖励: "+ result1[1] + " 银币";
    }
    else throw "未成功签到";
};

exports.check = async function(param) {
var resp = await axios.get("https://www.abooky.com/home.php?mod=spacecp&ac=usergroup",{maxRedirects: 0});
    if (/我的用户组/.test(resp.data))
        return true;
    else{
        var resp = await axios.get("https://www.abooky.com/member.php?mod=logging&action=login",{maxRedirects: 0});
        let loginhash = resp.data.match(/<div id="layer_login_(.*?)"/);
        let formhash = resp.data.match(/<input type="hidden" name="formhash" value="(.*?)"/);
        var resp = await axios.post("https://www.abooky.com/member.php?mod=logging&action=login&loginsubmit=yes&inajax=1&loginhash=" + loginhash[1],
            {
                "formhash": formhash[1],
                "referer": "https://www.abooky.com/./",
                "username": param.name,
                "cookietime": "2592000",
                "password": param.pwd,
                "questionid": 0,
                "answer": ""
            },
            {
                transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                  ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret.substr(0,ret.length-1);
              }],
                headers: {
                    "Origin": "https://www.abooky.com/",
                    "Upgrade-Insecure-Requests": "1",
                    "Referer": "https://www.abooky.com/member.php?mod=logging&action=login"
                }
            });
        if (/errorhandle/.test(resp.data)) throw resp.data.match(/errorhandle_\('(.*?)',/)[1];
        var resp = await axios.get("https://www.abooky.com/home.php?mod=spacecp&ac=usergroup",{maxRedirects: 0});
        return /我的用户组/.test(resp.data) ? true : false;
    }
};