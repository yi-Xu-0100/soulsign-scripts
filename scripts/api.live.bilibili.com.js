// ==UserScript==
// @name              bilibili直播
// @namespace         https://soulsign.inu1255.cn?account=inu1255
// @version           1.0.2
// @author            inu1255
// @loginURL          https://passport.bilibili.com/login
// @updateURL         https://soulsign.inu1255.cn/script/inu1255/bilibili直播
// @expire            900000
// @domain            api.live.bilibili.com
// ==/UserScript==

exports.run = async function (param) {
    var { data } = await axios.get('https://api.live.bilibili.com/sign/doSign');
    if (data.code == 0) return data.data.text;
    if (data.code == 1011040) return data.message;
    throw data.message;
};

exports.check = async function (param) {
    var { data } = await axios.get('https://api.live.bilibili.com/relation/v1/Feed/heartBeat');
    return data.code === 0;
};