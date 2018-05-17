import React from 'react';
import CouponItem from '../../mixComponent/CouponItem';
import './index.less';

export default function DoubleCoupon(props) {
    const { uid, data, marginBottom, ...styles } = props;

    if (data && data.list && data.list.length > 0) {
        return (
            <div id={uid} className="double-coupon-container" style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                {
                    data.list.map(function (coupon, i) {
                        return <CouponItem key={coupon.id} {...coupon} styles={styles} moduleType="double" />
                    })
                }
            </div>
        );
    } else {
        return <div id={uid}></div>;
    }
};