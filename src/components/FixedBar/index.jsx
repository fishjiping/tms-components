import React from 'react';
import './index.less';

export default class FixedBar extends React.Component {
    componentDidMount() {
        const { height } = this.props;
        let h;

        if (!height || isNaN(height)) {
            h = 0;
        } else {
            h = height;
        }

        document.body.style.paddingBottom = `${h / 100}rem`;
        document.querySelector('#toolbar').style.bottom = `${(h + 48) / 100}rem`;
    }

    get style() {
        const { height } = this.props;

        if (!height || isNaN(height)) {
            return {};
        } else {
            return {
                height: `${height / 100}rem`,
                overflow: 'hidden'
            };
        }

    }

    render() {
        const { pic, link } = this.props;
        return (
            <a className="fixed-bar" href={link} style={this.style}><img src={pic} style={{ width: '100%' }} alt="" /></a>
        );
    }
}