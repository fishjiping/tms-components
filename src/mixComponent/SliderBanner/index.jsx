import React from 'react';
import { generateLink } from '../../libs/util';
import SliderFactory from '../../libs/slider';
import './index.less';

export default class SliderBanner extends React.Component {
    componentDidMount() {
        this.slider = new SliderFactory({
            container: `#${this.props.uid}`,
            trigger: '.slider-status',
            hasTrigger : true,
            loop: true,
            play: true
        });
    }

    componentWillUnmount() {
        this.slider.destroy();
    }

    get sliderHeight() {
        const height = this.props.height || 300;
        return `${height / 100}rem`;
    }

    get sliderStyle() {
        return {
            height: this.sliderHeight
        };
    }

    get renderSliderPannel() {
        const { picList } = this.props;
        return picList.map((item) => {
			if(item && item.link) {
				return (
					<li style={{height: this.sliderHeight}}>
						<a href={generateLink(item.link)}>
							<img src={item.pic} alt="" />
						</a>
					</li>
				)
			} else {
				return (
					<li style={{height: this.sliderHeight}}>
						<img src={item.pic} alt="" />
					</li>
				)
			}
		});
    }

    render() {
        const { uid } = this.props;
        
		return (
			<div className="slider" id={uid} style={this.sliderStyle}>
				<div className="slider-outer">
                    <ul className="slider-wrap">{this.renderSliderPannel}</ul>
                </div>
                <div className="slider-status"></div>
			</div>
		);
    }
}
