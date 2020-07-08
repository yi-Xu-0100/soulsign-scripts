// ==UserScript==
// @name              百度文库签到
// @namespace         https://soulsign.inu1255.cn?account=inu1255
// @version           1.0.1
// @author            inu1255
// @loginURL          https://wenku.baidu.com
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/百度文库签到
// @expire            900000
// @domain            wenku.baidu.com
// ==/UserScript==

exports.run = async function (param) {
	var { data } = await axios.get("https://wenku.baidu.com/task/submit/signin", {
		headers: {
			"Referer": "https://wenku.baidu.com/task/browse/daily"
		}
	});
	if (data.errno == 0) return "成功"
	if (data.errno == 109) throw "需要登录"
	throw JSON.stringify(data)
};

exports.check = async function (param) {
	var { data } = await axios.get("https://wenku.baidu.com/xpage/form/getform?id=tob_home_left", {
		headers: {
			"Referer": "https://wenku.baidu.com/task/browse/daily"
		}
	});
	return data.status.code == 0
};