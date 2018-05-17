const ua = navigator.userAgent;

const env = {
    isWeiChat: /MicroMessenger/.test(ua),

    app: {
        version: ua.match(/appVersion\(([^)]+)\)/) ? ua.match(/appVersion\(([^)]+)\)/)[1] : '0.0.0',
        is: /bridgeLibVersion/.test(ua)
    },
    
    compareVersion: function (v1, v2) {
        v1 = v1 ? v1.toString().split('.') : [];
        v2 = v2 ? v2.toString().split('.') : [];

        for (var i = 0; i < v1.length || i < v2.length; i++) {
            var n1 = parseInt(v1[i], 10), n2 = parseInt(v2[i], 10);

            if (window.isNaN(n1)) {
                n1 = 0;
            }
            if (window.isNaN(n2)) {
                n2 = 0;
            }
            if (n1 < n2) {
                return -1;
            }
            else if (n1 > n2) {
                return 1;
            }
        }
        return 0;
    }
};

let matched;

if ((matched = ua.match(/Windows\sPhone\s(?:OS\s)?([\d\.]+)/))) {
    /**
     * @instance os
     * @member env
     * @property {String} name - 操作系统名称，比如Android/AndroidPad/iPhone/iPod/iPad/Windows Phone/unknown等
     * @property {Version} version - 操作系统版本号
     * @property {Boolean} isWindowsPhone - 是否是Windows Phone
     * @property {Boolean} isIPhone - 是否是iPhone/iTouch
     * @property {Boolean} isIPad - 是否是iPad
     * @property {Boolean} isIOS - 是否是iOS
     * @property {Boolean} isAndroid - 是否是Android手机
     * @property {Boolean} isAndroidPad - 是否是Android平板
     */
    env.os = {
        name: 'Windows Phone',
        isWindowsPhone: true,
        version: matched[1]
    }
} else if (!!ua.match(/Safari/) && (matched = ua.match(/Android[\s\/]([\d\.]+)/))) {
    env.os = {
        name: (!!ua.match(/Mobile\s+Safari/)) ? 'Android' : 'AndroidPad',
        isAndroid: true,
        version: matched[1]
    };
} else if ((matched = ua.match(/(iPhone|iPad|iPod)/))) {
    let name = matched[1];

    matched = ua.match(/OS ([\d_\.]+) like Mac OS X/);

    env.os = {
        name: name,
        isIPhone: (name === 'iPhone' || name === 'iPod'),
        isIPad: name === 'iPad',
        isIOS: true,
        version: matched[1].split('_').join('.')
    }
} else {
    env.os = {
        name: 'unknown',
        version: '0.0.0'
    }
}

export default env;