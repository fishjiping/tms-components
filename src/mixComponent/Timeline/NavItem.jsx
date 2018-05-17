import React from 'react';

export default class NavItem extends React.PureComponent {
    handleChange = () => {
        const { time, checked, onChangeNav } = this.props;

        if (!checked) {
            onChangeNav(time);
        }
    }
  
    render() {
        const { showTimeText, showStatusText, checked, styles } = this.props;

        if (checked) {
            return (
                <li className='active' style={{ backgroundColor: styles.selectedBgColor, color: styles.selectedColor }} onClick={this.handleChange}>
                    <span className="time-text">{showTimeText}</span>
                    <span className="status-text">{showStatusText}</span>
                </li>
            );
        } else {
            return (
                <li style={{ backgroundColor: styles.bgColor, color: styles.color }} onClick={this.handleChange}>
                    <span className="time-text">{showTimeText}</span>
                    <span className="status-text">{showStatusText}</span>
                </li>
            );
        }
    }
}