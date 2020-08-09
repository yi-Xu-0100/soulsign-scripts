// ==UserScript==
// @name              网易云音乐
// @namespace         https://soulsign.inu1255.cn/scripts/233
// @version           1.0.1
// @author            yi-Xu-0100
// @loginURL          https://music.163.com/#/login
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/网易云音乐
// @expire            900000
// @domain            music.163.com
// ==/UserScript==

exports.run = async function () {
    // 手机签到（10 点经验值）
    var point = 0;
    var { data } = await axios.get('http://music.163.com/api/point/dailyTask?type=0');
    if (data.code === 200) point += data.point;
    else if (data.code != -2) throw data.msg;

    // 电脑签到（5 点经验值）
    var { data } = await axios.get('http://music.163.com/api/point/dailyTask?type=1');
    if (data.code === 200) point += data.point;
    else if (data.code != -2) throw data.msg;

    if (point === 10) return "获得经验值 " + point + " 点，电脑端已签到";
    else if (point === 5) return "获得经验值 " + point + " 点，手机端已签到";
    else return "手机端，电脑端均已签到";

};

exports.check = async function () {
    var { data } = await axios.get('https://music.163.com/');
    return !(/GUser={}/.test(data));
};