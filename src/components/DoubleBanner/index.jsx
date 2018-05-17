import React from 'react';
import { generateLink } from '../../libs/util';
import './index.less';

export default function DoubleBanner (props) {
    const { uid, picList, marginBottom } = props;
    
    if (picList && picList.length > 0) {
        return (
            <ul className="double-banner" id={uid} style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                {
                    picList.map((item, i) => {
                        if(item.link) {
                            return (
                                <li key={i}>
                                    <a href={generateLink(item.link)}>
                                        <img src={item.pic} alt="" />
                                    </a>
                                </li>
                            )
                        } else {
                            return (
                                <li key={i}>
                                    <img src={item.pic} alt="" />
                                </li>
                            )
                        }
                    })
                }
            </ul>
        );
    } else {
        return <div id={uid}></div>;
    }
}