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
// @param            pwd 加密密码
// ==/UserScript==

/**
 * @file 阅次元签到脚本
 * @author yi-Xu-0100
 * @author Vicrack
 * @version 1.0.5
 */

/**
 * @module 阅次元签到脚本
 * @description 本脚本借鉴 [Vicrack 的鱼C论坛脚本](https://soulsign.inu1255.cn/scripts/167)，提供设置用户名和密码方式自动登陆，其中密码为真实密码的 MD5 加密后的密钥。
 * 
 * 脚本内容讨论请转至：[仓库 issue](https://github.com/yi-Xu-0100/soulsign-scripts/issues)
 * 
 * 签到插件讨论请转至：[官方 issue](https://github.com/inu1255/soulsign-chrome/issues)
 * @param {string|string[]} [domain = www.abooky.com] - 请求的域名
 * @param {string} [expire = 1200000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/174] - 脚本主页
 * @param {string} [loginURL = https://www.abooky.com/member.php?mod=logging&action=login] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/yi-Xu-0100/阅次元签到] - 脚本更新链接
 * @param {string} name - 账户
 * @param {string} pwd - 加密密码
 */

exports.run = async function (param) {
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
    if (signhtml1.includes("您的签到排名")) {
        let result1 = signhtml1.match(/<input type="hidden" class="hidnum" id="lxreward" value="(.*?)"/);
        return "积分奖励: " + result1[1] + " 银币";
    }
    else throw "未成功签到";
};

exports.check = async function (param) {
    var resp = await axios.get("https://www.abooky.com/home.php?mod=spacecp&ac=usergroup", { maxRedirects: 0 });
    if (/我的用户组/.test(resp.data))
        return true;
    else {
        var resp = await axios.get("https://www.abooky.com/member.php?mod=logging&action=login", { maxRedirects: 0 });
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
                    return ret.substr(0, ret.length - 1);
                }],
                headers: {
                    "Origin": "https://www.abooky.com/",
                    "Upgrade-Insecure-Requests": "1",
                    "Referer": "https://www.abooky.com/member.php?mod=logging&action=login"
                }
            });
        if (/errorhandle/.test(resp.data)) throw resp.data.match(/errorhandle_\('(.*?)',/)[1];
        var resp = await axios.get("https://www.abooky.com/home.php?mod=spacecp&ac=usergroup", { maxRedirects: 0 });
        return /我的用户组/.test(resp.data) ? true : false;
    }
};