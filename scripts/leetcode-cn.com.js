// ==UserScript==
// @name              力扣中国
// @namespace         https://soulsign.inu1255.cn/scripts/191
// @version           1.0.2
// @author            yi-Xu-0100
// @loginURL          https://leetcode-cn.com/
// @updateURL         https://soulsign.inu1255.cn/script/yi-Xu-0100/力扣中国
// @expire            900000
// @domain            leetcode-cn.com
// ==/UserScript==

exports.run = async function (param) {
    var defaultHeaders = { "Origin": "https://leetcode-cn.com/", "Referer": "https://leetcode-cn.com/points/" }
    var { data } = await axios.post('https://leetcode-cn.com/graphql/',
        {
            "operationName": "globalData",
            "variables": {},
            "query": "query globalData {\n  feature {\n    questionTranslation\n    subscription\n    signUp\n    discuss\n    mockInterview\n    contest\n    store\n    book\n    chinaProblemDiscuss\n    socialProviders\n    studentFooter\n    cnJobs\n    enableLsp\n    enableWs\n    enableDebugger\n    enableDebuggerAdmin\n    enableDarkMode\n    tasks\n    __typename\n  }\n  userStatus {\n    isSignedIn\n    isAdmin\n    isStaff\n    isSuperuser\n    isTranslator\n    isPremium\n    isVerified\n    isPhoneVerified\n    isWechatVerified\n    checkedInToday\n    username\n    realName\n    userSlug\n    groups\n    avatar\n    optedIn\n    requestRegion\n    region\n    activeSessionId\n    permissions\n    notificationStatus {\n      lastModified\n      numUnread\n      __typename\n    }\n    completedFeatureGuides\n    useTranslation\n    accountStatus {\n      isFrozen\n      inactiveAfter\n      __typename\n    }\n    __typename\n  }\n  siteRegion\n  chinaHost\n  websocketUrl\n  userBannedInfo {\n    bannedData {\n      endAt\n      bannedType\n      __typename\n    }\n    __typename\n  }\n}\n"
        },
        {
            headers: defaultHeaders
        });
    if (!data.data.userStatus.isSignedIn) throw "没有登录";
    if (data.data.userStatus.checkedInToday) return "重复签到";
    var { data } = await axios.get('https://leetcode-cn.com/points/api/total/',
        {
            headers: defaultHeaders
        });
    var originPoints = data.points;
    var { data } = await axios.post('https://leetcode-cn.com/graphql/',
        {
            "operationName": "checkin",
            "variables": {},
            "query": "mutation checkin {\n  checkin {\n    checkedIn\n    ok\n    error\n    __typename\n  }\n}\n"
        },
        {
            headers: defaultHeaders
        });
    var { data } = await axios.get('https://leetcode-cn.com/points/api/total/',
        {
            headers: defaultHeaders
        });
    var getPoints = data.points - originPoints;
    if (getPoints) return "今日获得 " + getPoints + " 积分";
    throw data;
};

exports.check = async function (param) {
    var { data } = await axios.get('https://leetcode-cn.com/explore/');
    return /isSignedIn: true/.test(data);
};