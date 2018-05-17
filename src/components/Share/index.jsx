import './index.less';
import React from 'react';
import env from '../../libs/env';
import Ajax from '../../libs/ajax';
import bridge from '../../libs/bridge';

export default class Share extends React.Component {
    constructor(props) {
        super(props);

        const { title, description, url, imgUrl } = this.props; 
        this.state = { visible: false };
        this.shareConfig = {
            title: title || document.title,
            description: description || '分享',
            url: url || window.location.href,
            imgUrl: imgUrl || ''
        };
    }

    /**
     * 
     * 分享给好友
     * @memberof Share
     */
    handleWeixinFriendShare = () => {
        const params = Object.assign({}, this.shareConfig, { type: 'sharelink' });
        bridge.callNative('weixin', true, params);
        
        // 埋点
        try {
            bridge.callNative('statistics', true, {
                tagKey: 'share_stat', 
                tagValue: JSON.stringify({ 'url': location.href, 'type': 'sharelink', 'data': JSON.stringify(this.shareConfig) })
            }, () => {});
        } catch (e) {}
    }

    /**
     * 
     * 分享到朋友圈
     * @memberof Share
     */
    handleWeixinShare = () => {
        const params = Object.assign({}, this.shareConfig, { type: 'shareFriend' });
        bridge.callNative('weixin', true, params);

        // 埋点
        try {
            bridge.callNative('statistics', true, {
                tagKey: 'share_stat', 
                tagValue: JSON.stringify({ 'url': location.href, 'type': 'shareFriend', 'data': JSON.stringify(this.shareConfig) })
            }, () => {});
        } catch (e) {}
    }
    
    showShare = () => {
        this.setState({ visible: true });
    }

    hideShare = () => {
        this.setState({ visible: false });
    }

    setwx = () => {
        const shareConfig = this.shareConfig;
        wx.ready(() => {
            wx.onMenuShareTimeline({
                title: shareConfig.title, // 分享标题
                link: shareConfig.link, // 分享链接
                imgUrl: shareConfig.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    // GlobalToast.show('分享成功');
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                    // GlobalToast.show('分享已取消');
                }
            });
    
            wx.onMenuShareAppMessage({
                title: shareConfig.title, // 分享标题
                desc: shareConfig.desc, // 分享描述
                link: shareConfig.link, // 分享链接
                imgUrl: shareConfig.imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    // GlobalToast.show('分享成功');
                },
                cancel: function() {
                    // 用户取消分享后执行的回调函数
                    // GlobalToast.show('分享已取消');
                }
            });
            // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
        });

        Ajax.get('//www.52shangou.com/member/ka/fetchSignature.do', {
            params: {
                url: encodeURIComponent(window.location.href.split('#')[0]),
                kaId: 1
            }
        }).then(data => {
            if (data.responseCode == 0) {
                if (env.isWeiChat) {
                    document.title = shareConfig.title;
                }

                wx.config({
                    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                    appId: 'wxfa1a0ed7732e083c', // 必填，公众号的唯一标识
                    timestamp: data.entry.timestamp, // 必填，生成签名的时间戳
                    nonceStr: data.entry.nonceStr, // 必填，生成签名的随机串
                    signature: data.entry.signature, // 必填，签名，见附录1
                    jsApiList: ['chooseWXPay', 'openLocation', 'getLocation', 'onMenuShareTimeline', 'onMenuShareAppMessage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                });
            } else {
                //console.log('','微信接口'+data.message)
            }
        });
    }

    componentDidMount() {
        if (env.isWeiChat) {
            this.setwx();
        } else if (env.app.is) {
            bridge.callNative('setTitleBarRight', false, {
                iconName: location.href.indexOf('tspBar=true') !== -1 ? 'share_w.png' : 'share.png',
                clickEvent: this.showShare
            });
        }
    }

    render() {
        const { visible } = this.state;
        return (
            <div style={{ display: visible ? 'block' : 'none'}}>
                <div className="share-bg" onClick={this.hideShare}></div>
                <div className="share-box">
                    <div className="share-title">分享到</div>
                    <div className="wx-share-btns">
                        <div className="wx-friend" onClick={this.handleWeixinShare}>微信好友</div>
                        <div className="wx-friend-timeline" onClick={this.handleWeixinFriendShare}>微信朋友圈</div>
                    </div>
                    <div className="cancel-btn" onClick={this.hideShare}>取消</div>
                </div>
            </div>
        );
    }
};