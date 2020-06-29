// ==UserScript==
// @name              什么值得买
// @namespace         https://soulsign.inu1255.cn?account=inu1255
// @version           1.0.0
// @author            inu1255
// @loginURL          https://zhiyou.smzdm.com/user/login
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/什么值得买
// @expire            900000
// @domain            zhiyou.smzdm.com
// ==/UserScript==

exports.run = async function() {
var { data } = await axios.get('https://zhiyou.smzdm.com/user/checkin/jsonp_checkin', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    if (data.error_code == 0) return '签到成功';
    throw data.error_msg || "失败";
};

exports.check = async function() {
var { data } = await axios.get('https://zhiyou.smzdm.com/user/checkin/jsonp_checkin', { headers: { 'Referer': 'https://www.smzdm.com/' } });
    return data.error_code == 0;
};