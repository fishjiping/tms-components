import React from 'react';
import { Toast } from 'antd-mobile';
import moment from 'moment';
import Ajax from '../../libs/ajax';
import Login from '../../libs/login';
import env from '../../libs/env';
import { urlParams, API_HOST } from '../../libs/util';
import eventBus from '../../libs/eventBus.js';
import './index.less';

const code = urlParams.code || '';

export default class CouponItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnText: props.btnText,
            actived: props.actived,
            contentUrl: props.contentUrl
        };
        this.bgColor = window.getComputedStyle(document.body).backgroundColor;
    }

    handleReveiveCoupon = () => {
        if (env.isWeiChat && !window.isBindPhone) {
            Login.goLogin((data) => {
                if (data.status && data.entry.ifBindMobile === 1) {
                    window.isBindPhone = true;
                    this.reveiveCouponRequest();
                } else {
                    eventBus.dispatch('bindPhone');
                }
            });
        } else {
            this.reveiveCouponRequest();
        }
    }

    reveiveCouponRequest = () => {
        const { id } = this.props;
        Ajax.get(`${API_HOST}/market/api/hongbao/sendHongbao.jsonp`, {
            params: {
                hongbaoSetId: id,
                organizeId: window.globalConfig && window.globalConfig.organizeId
            }
        }).then(res => {
            if (res && res.status && res.responseCode == 0) {
                Toast.success('领取成功！');
                this.updateCouponStatus(id);
            } else {
                Toast.fail(res.message || '领取失败！');
                this.updateCouponStatus(id);
            }
        }).catch(error => {
            Toast.fail('网络异常！');
        });
    }

    /**
     * 
     * 获取优惠券状态并更新
     * @param {any} id 
     * @memberof CouponItem
     */
    updateCouponStatus(id) {
        Ajax.get(`${API_HOST}/market/api/hongbao/list_sets.json`, {
            params: {
                filter: false,
                pId: id,
                organizeId: window.globalConfig && window.globalConfig.organizeId
            }
        }).then(res => {
            if (res.status && res.entry && res.entry.list) {
                const coupon = res.entry.list[0];
                this.setState({
                    btnText: coupon.btnText,
                    actived: coupon.actived,
                    contentUrl: coupon.contentUrl
                });
            }
        }).catch(error => {
            console.log(error.message);
        });
    }

    get couponType() {
        const { hongbaoType, amount, styles } = this.props;
        return (
            hongbaoType === '5' ?
                <p className="coupon-type" style={{ color: styles.nameColor }}>免邮券</p> :
                <p className="coupon-type" style={{ color: styles.nameColor }}>&yen;<span>{amount / 100}</span></p>
        );
    }

    get couponRule() {
        const { minOrderPrice, styles } = this.props;
        return (
            minOrderPrice === 0 ?
                <p className="coupon-rule" style={{ color: styles.titleColor }}>无门槛</p> :
                <p className="coupon-rule" style={{ color: styles.titleColor }}>{`满${minOrderPrice}使用`}</p>
        );
    }

    get couponBtn() {
        const { btnText, actived, contentUrl } = this.state;
        const { styles } = this.props;

        if (actived) {
            if (contentUrl) {
                return <a className="coupon-btn" href={contentUrl} style={{ color: styles.btnColor, backgroundColor: styles.btnBgColor }}>{btnText}</a>;
            } else {
                return <a className="coupon-btn" href="javascript:;" onClick={this.handleReveiveCoupon} style={{ color: styles.btnColor, backgroundColor: styles.btnBgColor }}><span>{btnText}</span></a>;
            }
        } else {
            return <a className="coupon-btn" href="javascript:;" style={{ color: styles.btnColor, backgroundColor: '#E2E2E2' }}>{btnText}</a>;
        }
    }

    render() {
        const { name, startTime, endTime, styles, moduleType } = this.props;

        return (
            <div className={`${moduleType}-coupon`} style={{ backgroundColor: styles.bgColor }}>
                <div className="coupon-content">
                    <div className="coupon-left">
                        {this.couponType}
                        {this.couponRule}
                    </div>
                    {
                            moduleType === 'single' && (<div className="separator-line">
                            <i className="dashed" style={{ backgroundColor: this.bgColor }}></i>
                            <i className="dashed" style={{ backgroundColor: this.bgColor }}></i>
                            <i className="dashed" style={{ backgroundColor: this.bgColor }}></i>
                            <i className="dashed" style={{ backgroundColor: this.bgColor }}></i>
                            <i className="dashed" style={{ backgroundColor: this.bgColor }}></i>
                            <i className="dashed" style={{ backgroundColor: this.bgColor }}></i>
                        </div>)
                    }
                    <div className="coupon-right">
                        {
                            moduleType === 'single' && <h3 className="title">{name}</h3>
                        }
                        <div className="time" style={{ color: styles.validityColor }}>有效期：{moment(startTime).format('MM-DD HH:mm')}至{moment(endTime).format('MM-DD HH:mm')}</div>
                        {this.couponBtn}
                    </div>
                    <i className="half-circle-before" style={{ backgroundColor: this.bgColor }}></i>
                    <i className="half-circle-after" style={{ backgroundColor: this.bgColor }}></i>
                </div>
            </div>
        );
    }
};