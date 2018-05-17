import React from 'react';
import { Toast } from 'antd-mobile';
import { urlParams, API_HOST } from '../../libs/util';
import Ajax from '../../libs/ajax';
import './index.less';

class BindPhone extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            visible: props.visible,
            phoneNum: '',
            phoneNumValid: false,
            securityCode: '',
            securityCodeValid: false,
            sendCodeTips: '发送验证码',
            helpTips: '收不到短信？ 试试使用语音验证码',
            watting: false
        };

        this.timer = null;
    }
    
    /**
     * 
     * 校验手机号码
     * @param {String} phoneNum 手机号码
     * @returns {Boolean}
     */
    validPhoneNum = (phoneNum) => {
        return /^1[0-9]{10}$/.test(phoneNum);
    };

    /**
     * 
     * 校验验证码
     * @param {String} securityCode 
     */
    validSecurityCode = (securityCode) => {
        return /^\d{4}$/.test(securityCode);
    }

    /**
     * 绑定手机号码change事件
     */
    handlePhoneNumChange = (e) => {
        let phoneNum = e.target.value.replace(/\s+/g, '').slice(0, 11);
        let phoneNumValid = false;

        if (this.validPhoneNum(phoneNum)) {
            phoneNumValid = true;
        }

        if (phoneNum.length > 7) {
            phoneNum = phoneNum.replace(/^(\d{3})(\d{4})/, "$1 $2 ");
        } else {
            phoneNum = phoneNum.replace(/^(\d{3})(\d{1,4})/, "$1 $2");
        }
        
        this.setState({
            phoneNum,
            phoneNumValid
        });
    }

    /**
     * 绑定验证码change事件
     */
    handleSecurityCodeChange = (e) => {
        let securityCode = e.target.value.replace(/\s+/g, '').slice(0, 4);
        let securityCodeValid = false;

        if (this.validSecurityCode(securityCode)) {
            securityCodeValid = true;
        }

        this.setState({
            securityCode,
            securityCodeValid
        });
    }

    /**
     * 短信验证
     */
    handleSendSecurityCode = () => {
        this.securityCodeInput && this.securityCodeInput.focus();

        const { 
            phoneNum,
            phoneNumValid, 
            watting
        } = this.state;

        if (phoneNumValid && !watting) {
            this.sendSecurityCode({
                mobile: phoneNum.replace(/\s+/g, ''),
                type: 'sms'
            }, () => {
                let limit = 29;
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    if (limit === 0) {
                        clearInterval(this.timer);
                        this.setState({
                            sendCodeTips: '重新发送验证码',
                            watting: false
                        });
                    } else {
                        this.setState({
                            sendCodeTips: `${limit} 秒后重发`,
                            watting: true
                        });
                    }
                    limit--;
                }, 1000);
            });
        }
    }

    /**
     * 语音验证
     */
    handleSendVoice = () => {
        const { 
            phoneNum,
            phoneNumValid, 
            watting
        } = this.state;

        if (phoneNumValid && !watting) {
            this.sendSecurityCode({
                mobile: phoneNum.replace(/\s+/g, ''),
                type: 'voice'
            }, () => {
                let limit = 29;
                clearInterval(this.timer);
                this.timer = setInterval(() => {
                    if (limit === 0) {
                        clearInterval(this.timer);
                        this.setState({
                            helpTips: `未收到来电？ 点击重新获取`,
                            watting: false
                        });
                    } else {
                        this.setState({
                            helpTips: `电话呼入中 ... ${limit} 秒后可重新点击获取`,
                            watting: true
                        });
                    }
                    limit--;
                }, 1000);
            });
        }
    }

    /**
     * 绑定手机号码
     */
    handleBindPhone = () => {
        const { 
            phoneNum,
            phoneNumValid, 
            securityCode,
            securityCodeValid,
            watting
        } = this.state;

        if (phoneNumValid && securityCodeValid) {
            this.sendBindPhone({
                mobile: phoneNum.replace(/\s+/g, ''),
                code: securityCode,
                orgId: window.globalConfig && window.globalConfig.organizeId
            }, this.handleCloseBindPhoneBox);
        }
    }

    /**
     * 关闭窗口
     */
    handleCloseBindPhoneBox = () => {
        clearInterval(this.timer);
        this.setState({
            visible: false
        });
    }

    /**
     * 
     * 发送验证码请求
     * @param {Object} params 
     * @param {Function} cb 
     */
    sendSecurityCode = (params, cb) => {
        params = Object.assign({
            kaId: 1,
            role: 'buyer',
            isEncrypt: true
        }, params);
    
        Ajax.get(`${API_HOST}/member/ka/sendAuthCodeV1.do`, { params }).then(res => {
            if (res && res.status) {
                Toast.success('已发送');
                cb && cb();
            } else {
                Toast.fail(res.message || '发送失败');
            }
        }).catch(error => {
            Toast.fail('网络异常！');
        });
    }

    /**
     * 
     * 绑定手机请求
     * @param {Object} params 
     * @param {Function} cb 
     */
    sendBindPhone = (params, cb) => {
        Ajax.postJSON(`${API_HOST}/member/ka/bindMobileV2.do`, { body: params }).then(res => {
            if (res && res.status) {
                Toast.success('绑定成功');
                cb && cb();
            } else {
                Toast.fail(res.message || '绑定失败');
            }
        }).catch(error => {
            Toast.fail('网络异常！');
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            visible: nextProps.visible,
            phoneNum: '',
            phoneNumValid: false, 
            securityCode: '', 
            securityCodeValid: false,
            sendCodeTips: '发送验证码',
            helpTips: '收不到短信？ 试试使用语音验证码',
            watting: false
        });
    }

    render() {
        const { 
            visible, 
            phoneNum, 
            phoneNumValid, 
            securityCode, 
            securityCodeValid,
            helpTips, 
            sendCodeTips, 
            watting 
        } = this.state;

        return (
            <div className={`bind-phone-box-wrapper ${visible ? '' : 'hide-box'}`}>
                <div className="box-content">
                    <div className="box-close-menu"><i onClick={this.handleCloseBindPhoneBox}></i></div>
                    <p className="phone">
                        <i></i>
                        <input
                            placeholder="请填写手机号码"
                            type="tel"
                            value={phoneNum}
                            onChange={this.handlePhoneNumChange}
                        />
                        <span
                            className={(phoneNumValid && !watting) ? 'active' : ''}
                            onClick={this.handleSendSecurityCode}
                        >{sendCodeTips}</span>
                    </p>
                    <p className="password">
                        <i></i>
                        <input
                            placeholder="请输入4位验证码"
                            type="number"
                            value={securityCode}
                            onChange={this.handleSecurityCodeChange}
                            ref={(ref) => this.securityCodeInput = ref}
                        />
                    </p>
                    <p className={phoneNumValid ? 'help-tips active' : 'help-tips'} onClick={this.handleSendVoice}>{helpTips}</p>
                    <button
                        className={phoneNumValid && securityCodeValid ? 'active': ''}
                        onClick={this.handleBindPhone}
                    >绑定</button>
                </div>
            </div>
        );
    }
}

export default BindPhone;