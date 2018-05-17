import './index.less';
import React from 'react';
import moment from 'moment';
import eventBus from '../../libs/eventBus';
import ItemLR from '../ItemLR';
import ItemTB from '../ItemTB';
import ThreeColumnItem from '../ThreeColumnItem';
import Sticky from '../../mixComponent/Sticky';
import Timeline from '../../mixComponent/Timeline'

export default class SeckillCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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

    /**
     * 
     * 获取当前正在抢购中的时间点
     * @param {Array} timeList  时间轴数组
     * @param {Number} currentTime 当前服务器时间，毫秒数
     * @returns 
     * @memberof SeckillCategory
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
            return item.onlineStartTime;
        });

        timeList.sort((a, b) => {
            return moment(a).valueOf() - moment(b).valueOf();
        });

        return Array.from(new Set(timeList));
    }

    getItemList(time) {
        const list = this.data.items;

        if (list) {
            return list.filter((item) => {
                return item.onlineStartTime === time;
            });
        } else {
            return [];
        }
    }

    render() {
        const { uid, data, arrangementMode, marginBottom, ...styles } = this.props;
        const { checkedTime, timeList, itemList } = this.state;

        if ( timeList.length > 0 ) {
            return (
                <div className="seckill-category" id={uid} style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                    <Sticky style={{ top: 0, zIndex:300 }}>
                        <Timeline 
                            data={timeList} 
                            checkedTime={checkedTime} 
                            currentTime={data.serverTime} 
                            styles={styles} 
                            onChange={this.handleChangeNav} 
                        />
                    </Sticky>
                    {
                        arrangementMode === 'lr' 
                        ? <ItemLR data={itemList} styles={styles} /> 
                        : arrangementMode === 'tb'
                            ? <ItemTB data={itemList} styles={styles} />
                            : <ThreeColumnItem data={itemList} styles={styles} />
                    }
                </div>
            );
        } else {
            return <div id={uid}></div>;
        }
    }
}