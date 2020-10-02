// ==UserScript==
// @name              阿里云签到
// @namespace         https://soulsign.inu1255.cn?account=inu1255
// @version           1.03
// @author            inu1255
// @loginURL          https://account.aliyun.com/login/qr_login.htm?oauth_callback=https%3A%2F%2Fclub.aliyun.com%2F%23%2F
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/阿里云签到
// @expire            900000
// @domain            club.aliyun.com
// @domain            account.aliyun.com
// @domain            passport.aliyun.com
// @param             name 账号
// @param             pwd 密码
// ==/UserScript==

/**
 * @file 阿里云签到脚本
 * @author inu1255
 * @version 1.0.3
 */

/**
 * @module 阿里云签到脚本
 * @description 本脚本是 [inu1255](https://github.com/inu1255) 所创造。
 * @param {string|string[]} [domain = club.aliyun.com] - 请求的域名
 * @param {string} [expire = 900000] - 在线检查频率
 * @param {string} [namespace = https://soulsign.inu1255.cn/scripts/228] - 脚本主页
 * @param {string} [loginURL = https://account.aliyun.com/login/qr_login.htm?oauth_callback=https%3A%2F%2Fclub.aliyun.com%2F%23%2F] - 登录链接
 * @param {string} [updateURL = https://soulsign.inu1255.cn/script/inu1255/阿里云签到] - 脚本更新链接
 */

const opts = {headers: {referer: "https://club.aliyun.com/"}};
exports.run = async function(param) {
	var {data} = await axios.get("https://club.aliyun.com/json/UserSignIn.json?signSource=pc&signCompany=aliyun", opts);
	await axios.get("https://club.aliyun.com/json/GetUserSignInfo.json?signSource=pc&signCompany=aliyun", opts);
	await axios.get("https://club.aliyun.com/json/GetUserAllPoint.json", opts);
	await axios.get("https://club.aliyun.com/json/GetUserDetailPoints.json?beginTime=&endTime=&source=&currentPage=1&pageSize=20", opts);
	if (data.success) return `获得${data.data.todayPoints}金币`;
	throw JSON.stringify(data);
};

exports.check = async function(param) {
	var {data} = await axios.get("https://club.aliyun.com/json/GetUserAllPoint.json", opts);
	if (data.success) return true;
	if (!(param.name && param.pwd)) return false;
	return await open(
		"https://account.aliyun.com/login/qr_login.htm?oauth_callback=https%3A%2F%2Fclub.aliyun.com%2F%23%2F",
		/** 调试时设置成true */ false,
		async (fb) => {
			let n = 500;
			while (n--) {
				// 获取页面所有iframe
				let frames = await fb.iframes();
				for (let fb of frames) {
					// 定位目标iframe,并模拟登录
					if (fb.url.startsWith("https://passport.aliyun.com/mini_login.htm")) {
						await tools.sleep(1e3);
						await fb.value("#fm-login-id", param.name);
						await fb.value("#fm-login-password", param.pwd);
						await fb.click(".fm-button.fm-submit.password-login");
						await fb.waitLoaded();
						return true;
					}
				}
				await tools.sleep(1e3);
			}
			return false;
		},
		function() {
			function o(cb) {
				this.cb = cb;
			}
			o.prototype.unobserve = function() {};
			o.prototype.disconnect = function() {};
			o.prototype.takeRecords = function() {};
			o.prototype.observe = function(target) {
				setTimeout(() => {
					this.cb([{target, isIntersecting: true}]);
				}, 0);
			};
			window.IntersectionObserver = o;
		}
	);
};