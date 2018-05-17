import React from 'react';
import moment from 'moment';
import { formatCountDown } from '../../libs/util';
import CountDown from '../../mixComponent/CountDown';
import Sticky from '../../mixComponent/Sticky';
import ItemLR from '../ItemLR';
import './index.less';

export default class PresellItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pastTime: 0
        };
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState((prevState, props) => ({
                pastTime: prevState.pastTime + 1000
            }));
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    get presellConfig() {
        const { 
            data,
            notStartBtnColor,
            processBtnColor,
            finishedBtnColor,
            notStartBtnFontColor,
            processBtnFontColor,
            finishedBtnFontColor
        } = this.props;
        const { pastTime } = this.state;
        const startTime = moment(`${data.items[0].actStartDate} 00:00:00`).valueOf();
        const endTime = moment(`${data.items[0].actEndDate} 23:59:59`).valueOf();
        const currentTime = data.serverTime + pastTime;

        if (startTime > currentTime) {
            return {
                countDown: Object.assign({ text: '距离预订开始' }, formatCountDown(currentTime, startTime)),
                itemBtn: {
                    btnText: '即将开始',
                    btnColor: notStartBtnColor,
                    btnFontColor: notStartBtnFontColor
                }
            };
        } else if (startTime <= currentTime && endTime > currentTime) {
            return {
                countDown: Object.assign({ text: '距离预订结束' }, formatCountDown(currentTime, endTime)),
                itemBtn: {
                    btnText: '立即预订',
                    btnColor: processBtnColor,
                    btnFontColor: processBtnFontColor
                }
            };
        } else {
            return {
                countDown: {
                    text: '预订已结束',
                    day: '00',
                    hour: '00',
                    minute: '00',
                    second: '00'
                },
                itemBtn: {
                    btnText: '已结束',
                    btnColor: finishedBtnColor,
                    btnFontColor: finishedBtnFontColor
                }
            };
        }

        return config;
    }

    render() {
        const { 
            uid, 
            data, 
            marginBottom, 
            ...styles 
        } = this.props;

        if ( data && data.items && data.items.length > 0 ) {
            const config = this.presellConfig;
            const countDownConfig = config.countDown;
            const itemBtnConfig = config.itemBtn;
            return (
                <div className="presell" id={uid} style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                    <Sticky style={{ top: 0, zIndex:300 }}>
                        <CountDown styles={styles} {...countDownConfig} />
                    </Sticky>
                    <ItemLR 
                        uid={`${uid}-item`} 
                        data={data} 
                        itemType="presell"
                        {...styles} 
                        {...itemBtnConfig}
                    />
                </div>
            );
        } else {
            return <div id={uid}></div>;
        }
    }
}