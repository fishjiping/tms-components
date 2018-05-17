import './index.less';
import React from 'react';
import moment from 'moment';
import NavItem from './NavItem';

export default class Timeline extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedTime: props.checkedTime
        }
    }

    handleChangeNav = (time) => {
        const { data, onChange } = this.props;
        const { checkedTime } = this.state;

        if (time !== checkedTime) {
            this.setState({ checkedTime: time });
            onChange(time);
        }
    }

    componentDidMount() {
        const scrollLeft = this.scrollBar.querySelector('.active').offsetLeft;
        this.scrollBar.scrollLeft = scrollLeft;
    }


    render() {
        const { data, currentTime, styles } = this.props;
        const { checkedTime } = this.state;
        const millisCurrentTime = moment(currentTime).valueOf();

        if ( data && data.length > 0 ) {
            return (
                <div className="timeline" style={{ backgroundColor: styles.bgColor }}>
                    <ul ref={(el) => { this.scrollBar = el; }}>
                        {
                            data.map((time, i) => {
                                const showTimeText = moment(time).format('HH:mm');
                                const millisTime = moment(time).valueOf();
                                const millisNextTime = data[i+1] ? moment(data[i+1]).valueOf() : '';
                                let showStatusText;

                                if (millisTime > millisCurrentTime) {
                                    showStatusText = '即将开始';
                                } else if (millisNextTime && millisCurrentTime > millisNextTime) {
                                    showStatusText = '抢购结束';
                                } else {
                                    showStatusText = '抢购中';
                                }

                                return (
                                    <NavItem 
                                        key={time} 
                                        checked={time === checkedTime} 
                                        time={time}
                                        showTimeText={showTimeText} 
                                        showStatusText={showStatusText} 
                                        styles={styles} 
                                        onChangeNav={this.handleChangeNav} 
                                    />
                                );
                            })
                        }
                    </ul>
                </div>
            );
        } else {
            return <div></div>;
        }
    }
}