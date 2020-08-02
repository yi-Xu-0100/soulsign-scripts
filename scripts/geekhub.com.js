// ==UserScript==
// @name              geekhub
// @namespace         https://soulsign.inu1255.cn/scripts/172
// @version           1.1.0
// @author            yi-Xu-0100
// @loginURL          https://geekhub.com/users/sign_in
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/geekhub
// @expire            900000
// @domain            geekhub.com
// ==/UserScript==

exports.run = async function (param) {
    var resp = await axios.get("https://geekhub.com/checkins");
    if (resp.data.includes("今日已签到")) return "重复签到";
    if (resp.data.includes("您需要登录后才能继续")) throw "未登录";
    let result = resp.data.match(/<meta name="csrf-token" content="(.*?)"/);
    let originGbit = resp.data.match(/<div class="w-3\/12">\s+<div>(\d*)<\/div>/);
    var resp = await axios.post('https://geekhub.com/checkins/start',
        {
            "_method": "post",
            "authenticity_token": result[1]
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
                "Origin": "https://geekhub.com",
                "Cache-Control": "max-age=0",
                "Upgrade-Insecure-Requests": "1",
                "Referer": "https://geekhub.com/checkins"
            }
        });
    if (/今日已签到/.test(resp.data)) {
        let todayGbit = resp.data.match(/<div class="w-3\/12">\s+<div>(\d*)<\/div>/);
        return "今日获得 " + (todayGbit[1] - originGbit[1]) + " Gbit";
    }
    else throw (/您需要登录后才能继续/.test(resp.data)) ? "未登录" : "未知错误";
};

exports.check = async function (param) {
    var resp = await axios.get("https://geekhub.com/checkins", { maxRedirects: 0 });
    return /您需要登录后才能继续/.test(resp.data) ? false : true;
};