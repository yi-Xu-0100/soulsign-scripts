// ==UserScript==
// @name              威锋网
// @namespace         https://soulsign.inu1255.cn/scripts/235
// @version           1.0.2
// @author            yi-Xu-0100
// @loginURL          https://www.feng.com/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/威锋网
// @expire            21600000
// @domain            www.feng.com
// @domain            api.wfdata.club
// @grant            cookie
// ==/UserScript==

exports.run = async function (param) {
    var userinfo = await getCookie('https://www.feng.com/', 'userInfo');
    if (userinfo === null) throw "请登录";
    var { data } = await axios.post('https://api.wfdata.club/v1/attendance/userSignIn',
        null,
        {
            headers: {
                "Origin": "https://www.feng.com",
                "Referer": "https://www.feng.com/",
                "X-Access-Token": JSON.parse(decodeURIComponent(userinfo)).accessToken,
                "X-Request-Id":
                    "WDQKt2+dxMxPlIA4Wz5yf9l2x4N3rKqe65uuHK/Bejny5n6HnQFQ/1M4IAalbcTwRCmIXqT4sbZkc9yl1tAlfA=="
            }
        });
    if (data.status.message != "success") {
        return data.status.message;
    } else {
        return `获得经验${data.data.getWeTicket}点` +
            ((data.data.extraWeTicket != "0") ? `，额外经验 ${data.data.extraWeTicket} 点` : "");
    }
};

exports.check = async function (param) {
    var { data } = await axios.get('https://www.feng.com/login');
    return !(/登录/.test(data));
};