// ==UserScript==
// @name              网易云音乐
// @namespace         https://soulsign.inu1255.cn/scripts/233
// @version           1.0.4
// @author            yi-Xu-0100
// @loginURL          https://music.163.com/#/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/网易云音乐
// @expire            900000
// @domain            music.163.com
// ==/UserScript==

exports.run = async function () {
    // 移动端签到（10 云贝）
    var point = 0;
    var { data } = await axios.get('http://music.163.com/api/point/dailyTask?type=0');
    if (data.code === 200) point += data.point;
    else if (data.code != -2) throw data.msg;

    // 桌面端签到（5 云贝）
    var { data } = await axios.get('http://music.163.com/api/point/dailyTask?type=1');
    if (data.code === 200) point += data.point;
    else if (data.code != -2) throw data.msg;

    if (point === 10) return "获得 " + point + " 云贝，桌面端已签到";
    else if (point === 5) return "获得 " + point + " 云贝，移动端已签到";
    else if (point === 15) return "获得 15 云贝";
    else return "桌面端、移动端均已签到";

};

exports.check = async function () {
    var { data } = await axios.get('https://music.163.com/');
    return !(/GUser={}/.test(data));
};