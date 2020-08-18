// ==UserScript==
// @name              人大经济论坛
// @namespace         https://soulsign.inu1255.cn?account=hithy123
// @version           1.0.0
// @author            hithy123
// @loginURL          https://bbs.pinggu.org/plugin.php?id=dsu_paulsign:sign
// @updateURL         https://soulsign.inu1255.cn/script/hithy123/人大经济论坛
// @expire            900000
// @domain            bbs.pinggu.org
// ==/UserScript==

exports.run = async function (param) {
    var { data } = await axios.post('https://bbs.pinggu.org/plugin.php?id=dsu_paulsign:sign&576989e1&infloat=yes&handlekey=dsu_paulsign&inajax=1&ajaxtarget=fwin_content_dsu_paulsign');
    if (/已经签到/.test(data)) return "已经签到";
    var m = /name="formhash" value="([^"]+)/.exec(data);
    if (!m) throw "签到失败";
    var formhash = m[1];
    var { data } = await axios.post('https://bbs.pinggu.org/plugin.php?id=dsu_paulsign:sign&operation=qiandao&infloat=1&inajax=1', `formhash=${formhash}&qdxq=kx`);
    if (/签到成功/.test(data)) return '签到成功';
    if (/已经签到/.test(data)) return '已经签到';
    throw '签到失败';
};

exports.check = async function (param) {
    var { data } = await axios.get('https://bbs.pinggu.org/plugin.php?id=dsu_paulsign:sign&576989e1&infloat=yes&handlekey=dsu_paulsign&inajax=1&ajaxtarget=fwin_content_dsu_paulsign');
    if (/已经签到/.test(data)) return true;
    var m = /name="formhash" value="([^"]+)/.exec(data);
    if (!m) return false;
    return true;
};