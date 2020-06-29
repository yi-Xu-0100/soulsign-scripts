// ==UserScript==
// @name              v2ex签到
// @namespace         https://soulsign.inu1255.cn?account=inu1255
// @version           1.0.8
// @author            inu1255
// @loginURL          https://www.v2ex.com/signin
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/v2ex签到
// @expire            360000
// @domain            www.v2ex.com
// ==/UserScript==
exports.run = async function(param) {
var defaultheaders={"referer": "https://www.v2ex.com/","upgrade-insecure-requests": 1};
var ret = await axios.get('https://www.v2ex.com/mission/daily', {headers: defaultheaders});
    if (/登录</.test(ret.data)) throw '需要登录';
    if (/每日登录奖励已领取/.test(ret.data)) return '已领取';
    let m = /redeem\?once=(.*?)'/.exec(ret.data);
    if (!m) throw '失败1';
    await axios.get('https://www.v2ex.com/mission/daily/redeem?once=' + m[1], {headers: defaultheaders});
    var ret = await axios.get('https://www.v2ex.com/mission/daily', {headers: defaultheaders});
    if (/每日登录奖励/.test(ret.data)) return '成功';
    throw '失败2';
};

exports.check = async function(param) {
var now = Date.now();
    if(this.expired > now) return this.prev_check;
    this.expired = now + 60e3;
    var ret = await axios.get('https://www.v2ex.com/t/510849', { maxRedirects: 0, headers:{"referer": "https://www.v2ex.com/","upgrade-insecure-requests": 1} });
    return this.prev_check = !/>现在注册</.test(ret.data);
};