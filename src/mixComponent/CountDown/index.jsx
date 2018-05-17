import React from 'react';
import './index.less';

export default function CountDown (props) {
    const { 
        text,
        day,
        hour,
        minute,
        second,
        styles 
    } = props;

    return (
        <div className="count-down" style={{ backgroundColor: styles.countDownTitleBgColor }}>
            <div className="cd-text" style={{ color: styles.countDownTitleColor }}>{text}</div>
            <div className="cd-time">
                <span className="number" style={{ color: styles.countDownTimeColor, backgroundColor: styles.countDownTimeBgColor }}><em>{day}</em></span>
                <span className="unit" style={{ color: styles.countDownTitleColor }}>天</span>
                <span className="number" style={{ color: styles.countDownTimeColor, backgroundColor: styles.countDownTimeBgColor }}><em>{hour}</em></span>
                <span className="unit" style={{ color: styles.countDownTitleColor }}>小时</span>
                <span className="number" style={{ color: styles.countDownTimeColor, backgroundColor: styles.countDownTimeBgColor }}><em>{minute}</em></span>
                <span className="unit" style={{ color: styles.countDownTitleColor }}>分</span>
                <span className="number" style={{ color: styles.countDownTimeColor, backgroundColor: styles.countDownTimeBgColor }}><em>{second}</em></span>
                <span className="unit" style={{ color: styles.countDownTitleColor }}>秒</span>
            </div>
        </div>
    );
}