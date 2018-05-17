import './index.less';
import React from 'react';
import { throttle, changeScrollTop } from '../../libs/util';

export default class BackTop extends React.Component {
    constructor(props) {
        super(props)
        this.state = { visible: false };
    }

    handleBackTop() {
        changeScrollTop({ 
            distance: 0, 
            speed: 8 
        });
    }

    componentDidMount() {
        const winHeight = Math.max(document.documentElement.clientHeight, window.innerHeight)
        const scrollEvent = throttle(() => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop > winHeight * 0.5) {
                this.setState({ visible: true });
            } else {
                this.setState({ visible: false });
            }
        }, 200);

        window.addEventListener('scroll', scrollEvent , false);
    }

    render() {
        const { visible } = this.state;
        return (
            <div className={visible ? 'back-top' : 'back-top hidden'} onClick={this.handleBackTop}></div>
        );
    }
}