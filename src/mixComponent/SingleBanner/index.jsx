import React from 'react';
import { generateLink } from '../../libs/util';
import './index.less';

export default function SingleBanner (props) {
    const { uid, height, picList } = props;
    let styles;
    
    if (!height || isNaN(height)) {
        styles = {};
    } else {
        styles = {
            height: `${height / 100}rem`,
            overflow: 'hidden'
        };
    }

    return (
        <div style={styles}>
            {
                picList[0].link ?
                <a href={generateLink(picList[0].link)}><img style={{ width: '100%' }} src={picList[0].pic} alt="" /></a> :
                <img style={{ width: '100%' }} src={picList[0].pic} alt="" />
            }
        </div>
    );
}