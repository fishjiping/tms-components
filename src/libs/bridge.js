/**
 * lib.bridge v2.0.5
 */
import env from './env';

const IFRAME_PREFIX = 'iframe_';
const JS_BRIDGE_CALLBACK_PREFIX = 'js_bridge_callback_';
let incId = 1;
let iframePool = [];
let iframeLimit = 5;

const interceptURLJavascriptBridgeCore = {
    getSid() {
        return Math.floor(Math.random() * (1 << 50)) + '' + incId++;
    },

    registerCallback(sid, callback) {
        if (callback) {
            const callbackName = JS_BRIDGE_CALLBACK_PREFIX + sid;
            window[callbackName] = callback;
            return callbackName;
        }
    },

    syncXHR(url, callback) {
        let result;
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        result = xhr.responseText;
        if (result === 'false' || result === 'no value') {
            callback && callback({status: false, result: result});
            return {status: false, result: result};
        } else {
            callback && callback({status: true, result: result});
            return {status: true, result: result};
        }
    },

    createIframe: function (sid, url) {
        const iframeId = IFRAME_PREFIX + sid;
        let iframe;
        if (iframePool.length >= iframeLimit) {
            iframe = iframePool.shift();
        }
        if (!iframe) {
            iframe = document.createElement("iframe");
            iframe.style.cssText = 'width:0;height:0;border:0;display:none;';
            iframe.setAttribute("frameborder", "0");
        }
        iframe.setAttribute("id", iframeId);
        iframe.src = url;
        if (!iframe.parentNode) {
            setTimeout(() => {
                document.body.appendChild(iframe);
                this.retrieveIframe(sid);
            }, 5);
        } else {
            this.retrieveIframe(sid);
        }
    },

    retrieveIframe: function (sid) {
        const iframeId = IFRAME_PREFIX + sid;
        const iframe = document.querySelector('#' + iframeId);

        if (iframePool.length >= iframeLimit) {
            document.body.removeChild(iframe);
        } else {
            iframePool.push(iframe);
        }
    },

    callMethod: function (method, async, params, callback) {
        let search;
        let encodeSearch;
        let sid;
        let url;

        switch (method) {
            case 'setTitleBarLeft':
            case 'setTitleBarMiddle':
            case 'setTitleBarRight':
                if (typeof params.clickEvent === 'function') {
                    sid = this.getSid();
                    params.clickEvent = this.registerCallback(sid, params.clickEvent);
                }
                break;
            case 'setTitleBarRightNew':
                try {
                    const rightParam = JSON.parse(params.rightTitle);
                    rightParam.forEach((data, i) => {
                        if (typeof data.clickEvent === 'function') {
                            sid = this.getSid();
                            data.clickEvent = this.registerCallback(sid, data.clickEvent);
                        }
                    });
                    params.rightTitle = JSON.stringify(rightParam);

                } catch (e) {}
                break;
            case 'backwardData':
                break;
            default :
                if (async === true) {
                    sid = this.getSid();
                    // 增加if判断，兼容老版本桥接方式
                    if (typeof params.callback !== 'string') {
                        params.callback = this.registerCallback(sid, (data) => {
                            const returnData = {
                                status: true
                            };

                            if (method === 'getVersion') {
                                returnData.result = {
                                    curVersion: data,
                                    lstVersion: arguments[1]
                                }
                            } else if (method === 'getLocation') {
                                returnData.result = {
                                    longitude: data,
                                    latitude: arguments[1]
                                }
                            } else {
                                returnData.result = data;
                            }
                            callback && callback(returnData);
                        });
                    }
                }
                break;
        }

        search = JSON.stringify({
            "action": method,
            "params": params
        });
        encodeSearch = encodeURIComponent(search);

        if (async === true) {
            url = "daguanjia://operation?" + encodeSearch;
            this.createIframe(sid, url);
        } else {
            url = location.origin + "/bridge/operation?" + encodeSearch;
            return this.syncXHR(url, callback);
        }
    }
};

const bridge = {
    // bridge版本号
    version: navigator.userAgent.match(/bridgeLibVersion\(([^\(]+)\)/) && navigator.userAgent.match(/bridgeLibVersion\(([^\(]+)\)/)[1],

    /**
     * 桥接调用方式
     * @param method {String} 桥接方法
     * @param async {Boolean} 桥接调用方式, 可选,默认为false
     * @param params {Object} 桥接参数
     * @param callback {Function} 回调函数
     */
    callNative: function (method, async, params, callback) {
        if (typeof async !== 'boolean') {
            callback = params || function () {};
            params = async;
            async = false;
        }

        if (!env.app.is) {
            console.log('JS_BRIDGE_UNAVAILABLE');
            callback && callback({status: false, message: 'JS_BRIDGE_UNAVAILABLE', result: ''});
        } else {
            if (Object.prototype.toString.call(params) !== "[object Object]") params = {};

            // 处理同步异步名称不一致或方法名不一致问题
            switch (method) {
                case 'get':
                    if (async === false) method = 'get_sync';
                    break;
                case 'set':
                    method = (async === false) ? 'set_sync' : 'save';
                    break;
                case 'delete':
                    if (async === false) method = 'delete_sync';
                    break;
                case 'getNetwork':
                    if (async === false) method = 'getNetwork_sync';
                    break;
                case 'statistics':
                    if (env.os.isAndroid && params.priority !== '0' && params.priority !== '1' && params.priority !== '2') params.priority = '2';
                    if (async === false) method = 'statistics_sync';
                    break;
                case 'nextPage':
                    method = 'page';
                    break;
            }

            /**
             * webviewBridgeMd5Id用来解决IOS无法识别同步桥接调用自哪个webview导致操作过快Bridge在错误webview中执行而设
             * webview load页面时，IOS会在页面注入webviewBridgeMd5Id参数，Bridge调用的时候传给IOS做校验
             * IOS根据参数确定Bridge调用自哪个webview.
            */
            params['webviewBridgeMd5Id'] = window.webviewBridgeMd5Id;
            return interceptURLJavascriptBridgeCore.callMethod(method, async, params, callback);
        }
    }
};

export default bridge;