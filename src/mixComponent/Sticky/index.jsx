import stickybits from '../../libs/sticky';

export default class Sticky extends React.Component {
    componentDidMount() {
		stickybits(this.stickyEl, {});
    }

	render() {
        const { children, style } = this.props;
		return (
            <div className="sticky-box" ref={(el) => {this.stickyEl = el;}} style={style}>
                {children}
            </div>
        );
	}
}