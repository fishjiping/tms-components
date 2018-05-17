import './index.less';
import React from 'react';
import moment from 'moment';
import eventBus from '../../libs/eventBus';
import ItemLR from '../ItemLR';
import Sticky from '../../mixComponent/Sticky';
import PresellNav from '../../mixComponent/PresellNav'

export default class MultiplePresellItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pastTime: 0,
            checkedTime: '',
            timeList: [],
            itemList: {
                items: []
            }
        }
    }

    handleChangeNav = (time) => {
        this.setState({ 
            itemList: {
                items: this.getItemList(time)
            }
        });
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState((prevState, props) => ({
                pastTime: prevState.pastTime + 1000
            }));
        }, 1000);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && this.props.data !== nextProps.data) {
            this.data = nextProps.data;
            const timeList = this.getTimeList();
            const checkedTime = this.getCheckedTime(timeList, nextProps.data.serverTime);
            const itemList = this.getItemList(checkedTime);
            this.setState({ 
                checkedTime,
                timeList,
                itemList: {
                    items: itemList
                }
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // 如果是通过切换时间更新数据,则触发懒加载
        if (this.state.itemList !== prevState.itemList) {
            eventBus.dispatch('fireLazyload');
        }
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    /**
     * 
     * 获取当前正在抢购中的时间点
     * @param {Array} timeList  时间轴数组
     * @param {Number} currentTime 当前服务器时间，毫秒数
     * @returns 
     * @memberof MultiplePresellItem
     */
    getCheckedTime(timeList, currentTime) {
        let checkedTime;

        for(let i = 0, len = timeList.length; i < len; i++ ) {
            if (moment(timeList[i]).valueOf() > currentTime) {
                if (i === 0) {
                    checkedTime = timeList[0];
                } else {
                    checkedTime = timeList[i - 1];
                }
                break;
            } else {
                if (i === len - 1) {
                    checkedTime = timeList[len - 1];
                }
            }
        }

        return checkedTime;
    }

    getTimeList() {
        const list = this.data.items;

        if (!list) return [];

        let timeList = this.data.items.map((item) => {
            return item.actStartDate;
        });

        timeList = Array.from(new Set(timeList));

        return timeList.sort((a, b) => {
            return moment(a).valueOf() - moment(b).valueOf();
        });
    }

    getItemList(time) {
        const list = this.data.items;

        if (list) {
            return list.filter((item) => {
                return item.actStartDate === time;
            });
        } else {
            return [];
        }
    }

    render() {
        const { uid, data, marginBottom, ...styles } = this.props;
        const { pastTime, checkedTime, timeList, itemList } = this.state;

        if ( timeList.length > 0 ) {
            return (
                <div className="multiple-presell" id={uid} style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                    <Sticky style={{ top: 0, zIndex: 300 }}>
                        <PresellNav 
                            data={timeList} 
                            checkedTime={checkedTime} 
                            currentTime={pastTime + data.serverTime} 
                            styles={styles} 
                            onChange={this.handleChangeNav} 
                        />
                    </Sticky>
                    <ItemLR 
                        uid={`${uid}-item`} 
                        data={itemList} 
                        itemType="multiplePresell"
                        currentTime={pastTime + data.serverTime} 
                        {...styles} 
                    />
                </div>
            );
        } else {
            return <div id={uid}></div>;
        }
    }
}