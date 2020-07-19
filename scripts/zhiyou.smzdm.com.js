// ==UserScript==
// @name              什么值得买
// @namespace         https://soulsign.inu1255.cn/scripts/206
// @version           1.0.2
// @author            yi-Xu-0100
// @loginURL          https://zhiyou.smzdm.com/user/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/什么值得买
// @expire            900000
// @domain            zhiyou.smzdm.com
// ==/UserScript==

exports.run = async function (param) {
    var { data } = await axios.get('https://zhiyou.smzdm.com/user/checkin/jsonp_checkin', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    if (data.error_code == 0) return '已连续签到 ' + data.data.checkin_num + " 天";
    throw data.error_msg || "签到失败";
};

exports.check = async function (param) {
    var { data } = await axios.get('https://zhiyou.smzdm.com/user/', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    return /个人中心 \| 什么值得买/.test(data);
};