import React from 'react';
import SliderBanner from '../../mixComponent/SliderBanner';
import SingleBanner from '../../mixComponent/SingleBanner';
import './index.less';

export default function Banner (props) {
    const { picList, marginBottom } = props;

    if (picList.length > 1) {
        return (
            <div className="banner" style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                <SliderBanner {...props} />
            </div>
        );
    } else if (picList.length === 1) {
        return (
            <div className="banner" style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                <SingleBanner {...props} />
            </div>
        );
    } else {
        return <div></div>
    }
}
