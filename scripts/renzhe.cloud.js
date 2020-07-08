// ==UserScript==
// @name              忍者云签到
// @namespace         https://soulsign.inu1255.cn/scripts/173
// @version           1.0.8
// @author            yi-Xu-0100
// @loginURL          https://renzhe.cloud/auth/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/忍者云签到
// @expire            900000
// @domain            renzhe.cloud
// @param            name 账户
// @param            pwd 密码
// ==/UserScript==

exports.run = async function (param) {
	var data = await axios.post('https://renzhe.cloud/user/checkin');
	if (/成功/.test(data.data.msg))
		return data.data.msg;
	else if (/您似乎已经签到过了/.test(data.data.msg))
		return "重复签到";
	else if (/获得了 \d{0,4} MB流量/.test(data.data.msg))
		return data.data.msg;
	else
		throw '检查是否登录';
};

exports.check = async function (param) {
	var { data } = await axios.get('https://renzhe.cloud/user');
	if (/用户中心/.test(data))
		return true;
	else {
		var data = await axios.post('https://renzhe.cloud/auth/login', { email: param.name, passwd: param.pwd, remember_me: "on" });
		if (/登录成功/.test(data.data.msg))
			return true;
		else
			return false;
	}
};