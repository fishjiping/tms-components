const throttle = function (func, wait) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    var later = function () {
        previous = Date.now();
        timeout = null;
        result = func.apply(context, args);
    };
    return function () {
        var now = Date.now();
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            result = func.apply(context, args);
        } else if (!timeout) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

let timerForChangeScrollTop = null;
const changeScrollTop = function (params) {
    let distance = params.distance;
    let speedy = params.speed || 8;
    let callback = params.callback;
    let speed1 = '';
    let scrollTopLocal = document.documentElement.scrollTop || document.body.scrollTop;
    clearInterval(timerForChangeScrollTop);

    timerForChangeScrollTop = setInterval(function () {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const speed = (scrollTop - distance) / speedy;
        if (scrollTop == distance || speed1 == speed) {
            document.documentElement.scrollTop = distance;
            document.body.scrollTop = distance;
            clearInterval(timerForChangeScrollTop);
            callback && callback();
            return;
        }

        if ((speed > 0 && scrollTopLocal < scrollTop) || (speed < 0 && scrollTopLocal > scrollTop)) {
            clearInterval(timerForChangeScrollTop);
            callback && callback();
            return;
        }

        scrollTopLocal = scrollTop;
        document.documentElement.scrollTop = scrollTop - speed;
        document.body.scrollTop = scrollTop - speed;
        speed1 = speed;
    }, 30);
};


const deepCopy = function (obj) {
    let str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj), //系列化对象
            newobj = JSON.parse(str); //还原
    } else {
        for (var i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                deepCopy(obj[i]) : obj[i];
        }
    }
    return newobj;
};

const formatprice = function ({
    value,
    number = 2,
    remove0 = true
}) {
    let valuetostr = value ? value - 0 : 0;
    let returndata = 0;
    let jdnum = number || number == 0 ? number : 2;
    returndata = valuetostr.toFixed(jdnum) + '';
    if (remove0) {
        returndata = returndata.replace(/\.00/g, "");
    }
    return returndata;
};

const formatCountDown = function (startTime, endTime) {
    let time = endTime - startTime;
    let day;
    let hour;
    let minute;
    let second;
    
    day = parseInt(time / (24 * 60 * 60 * 1000));
    time = time - day * 24 * 60 * 60 * 1000;
    hour = parseInt(time / (60 * 60 * 1000));
    time = time - hour * 60 * 60 * 1000;
    minute = parseInt(time / (60 * 1000));
    time = time - minute * 60 * 1000;
    second = parseInt(time / 1000);

    return {
        day: day >= 10 ? day : `0${day}`,
        hour: hour >= 10 ? hour : `0${hour}`,
        minute: minute >= 10 ? minute : `0${minute}`,
        second: second >= 10 ? second : `0${second}`
    }
}

const API_HOST = (function () {
    const hostname = location.hostname;
    if (/daily/.test(hostname)) {
        return `${location.protocol}//daily.52shangou.com`;
    } else if (/gray/.test(hostname)) {
        return `${location.protocol}//gray.52shangou.com`;
    } else {
        return `${location.protocol}//www.52shangou.com`;
    }
})();

const urlParams = (function () {
    var search = window.location.search.replace(/^\?/, '');
    var params;
    var result = {};
    if (search) {
        params = search.split('&');
        for (var i = 0; i < params.length; i++) {
            params[i] = params[i].split('=');
            try {
                result[params[i][0]] = decodeURIComponent(params[i][1]);
            } catch (e) {
                result[params[i][0]] = params[i][1];
            }
        }
    }
    return result;
})();

const generateLink = function (link) {
    if (link.indexOf('?') !== -1 && link.indexOf('shopIds') !== -1) {
        return `${link}&page=new-app-page`;
    } else {
        return `${link}${link.indexOf('?') === -1 ? '?page=new-app-page&shopIds=' : '&page=new-app-page&shopIds='}${urlParams.shopIds || ''}`;
    }
}

export {
    throttle,
    changeScrollTop,
    deepCopy,
    formatprice,
    formatCountDown,
    API_HOST,
    urlParams,
    generateLink
}