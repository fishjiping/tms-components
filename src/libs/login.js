import { Toast } from 'antd-mobile';
import env from './env';
import { urlParams, API_HOST } from './util';
import Ajax from './ajax';
import bridge from './bridge';

const code = urlParams.code || '';
const ORG_ID = (window.globalConfig && window.globalConfig.organizeId) || '25';
let cache_appId = '';
    
const Login =  {
    goLogin: function (cb) {
        if (env.isWeiChat) {
            if (cache_appId) {
                this.getOpenId(cache_appId, cb);
            } else {
                this.getAppId(cb);
            }
        } else if (env.app.is) {
            bridge.callNative('startNativePage', true, {
                "url": "daguanjia://go/login"
            }, function (data) {});
        } else {
            const LOGIN_LINK = '/lianhua/login.html?';
            location.href = `${location.origin + LOGIN_LINK}redirectUrl=${location.href}`
        }
    },

    getLoginStatus: function (cb) {
        Ajax.get(`${API_HOST}/member/ka/checkKaLogin.do`, {
            params: {
				orgId: ORG_ID
			}
        }).then((data) => {
            if (data.status && KA_OPEN_ID) {
                //登录成功
                cb && cb();
            } else {
                this.getAppId(cb);
            }
        });
	},

    getAppId: function (cb) {
        Ajax.get(`${API_HOST}/member/ka/getOrgGzhAppId.do`, {
            params: {
				orgId: ORG_ID
			}
        }).then((data) => {
            if (data.status) {
                cache_appId = data.entry;
                this.getOpenId(data.entry, cb);
            }
        });
    },

    getOpenId: function (appId, cb) {
		if (code == undefined || code == '') {
			this.wxAuthorize(appId);
		} else {
			this.wxLogin(cb);
        }
    },

    wxAuthorize: function (appId) {
        location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId || cache_appId}&redirect_uri=${encodeURIComponent(window.location.href)}&response_type=code&scope=snsapi_userinfo&state=zh#wechat_redirect`;
    },
    
    wxLogin: function (cb) {
        Ajax.get(`${API_HOST}/member/wxKaGzhPassport.do`, {
            params: {
				code: code,
				orgId: ORG_ID
			}
        }).then((data) => {
            if (data.status) {
                cb && cb(data);
             } else {
                Toast.fail(data.message || '登录失败');
            }
        });
	}
};

export default Login;