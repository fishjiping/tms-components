/**
 * 异步请求， 使用fetch API
 * IE下使用polyfill
 */
import 'whatwg-fetch';
import { hex_md5 } from "./md5"
import env from './env';
import Login from './login';

const param2string = (params) => {
    let ps = Object.keys(params).map(key => {
        return `${key}=${params[key] || ''}`;
    })

    return ps.join('&');
}

export default class Ajax {
    /**
     * 签名
     */
    static generateSN (data) {
        const keys = Object.keys(data);
        const sk = "iS0Dc7zK2/Ef/rxoe480Yg==";
        let sn = "";

        keys.sort().forEach(function (key) {
            sn += key;
            sn += '=';
            sn += encodeURIComponent(data[key]);
            sn += '&'
        });
        sn = sn.slice(0, -1);
        sn += sk;
        sn = hex_md5(sn)
        return sn;
    }

    static encryptData (data) {
        const ak = 'aMdi6T4a2kA=';
        data = Object.assign({ ak }, data);
        data.sn = this.generateSN(data);
        return data;
    }

    /**
     * 普通的get请求
     */
    static get(url, options = {}) {
        if (!url) { url = '/'};

        if (!options) {
            options = {};
        }

        options.method = 'GET';

        if (typeof options.params === 'object') {
            if (options.params.isEncrypt) {
                delete options.params.isEncrypt;
                options.params = this.encryptData(options.params);
            }
            options.params = param2string(options.params);
        }

        if (options.params) {
            if (url.indexOf('?') < 0) {
                url += `?${options.params}`
            } else {
                url += `&${options.params}`
            }
        }
        

        delete options.params;

        return this._request(url, options);
    }

    static post(url, options = {}) {
        if (!url) { url = '/' }

        options.method = 'POST';

        options = Object.assign({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }, options);

        if (options.headers['Content-Type'] === 'application/x-www-form-urlencoded' && typeof options.body === 'object') {
            if (options.body.isEncrypt) {
                delete options.body.isEncrypt;
                options.body = this.encryptData(options.body);
            }
            options.body = param2string(options.body);
        }

        return this._request(url, options);
    }

     /*
     注意：参数通过options.body传递，例如Ajax.post(url, {body: {id:9527}})
     */
    static postForm(url, options = {}) {
        if (!url) { url = '/'; }

        options.method = 'POST';
        
        if (options.body && options.body.isEncrypt) {
            delete options.body.isEncrypt;
            options.body = this.encryptData(options.body);
        }

        let formData = new FormData();
        Object.keys(options.body).forEach(key => {
            formData.append(key, options.body[key])
        })

        options.body = formData;

        return this._request(url, options);
    }

    static postJSON(url, options = {}) {
        options.headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

        if (options.body && options.body.isEncrypt) {
            delete options.body.isEncrypt;
            options.body = this.encryptData(options.body);
        }

        options.body = JSON.stringify(options.body);

        return this.post(url, options);
    }

    static _request(url, options = {}) {
        let counter = 0;

        // 携带cookie
        options = Object.assign({
            credentials: 'include'
        }, options)


        function sendRequest(url, options) {
            return fetch(url, options).then(res => {
                if (res.status < 200 || res.status >= 300) {
                    let err = new Error(res.statusText);
                    err.response = res;
                    throw err;
                }
                return res.json();
            }).then(json => {
                // 10212表示未登录，11028表示用户登录账号未匹配当前ka
                if (json.status === false && (json.responseCode === 10212 || json.responseCode === 11028) ) {
                    if (counter < 3) {
                        counter += 1;
                        Login.goLogin(() => {
                            sendRequest(url, options);
                        });
                    } else if (env.isWeiChat) {
                        Login.wxAuthorize();
                    }
                    
                    return json;
                } else {
                    return json;
                }
            })
        }
        
        return sendRequest(url, options);
    }
}