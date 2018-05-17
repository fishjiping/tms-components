import React from 'react';

export default class NavItem extends React.PureComponent {
    handleChange = () => {
        const { navName, checked } = this.props;

        if (!checked) {
            this.props.onChangeNav(navName);
        }
    }
  
    render() {
        const { navName, checked, styles } = this.props;

        if (checked) {
            return (
                <li className="active" style={{ color: styles.selectedFontColor }} onClick={this.handleChange}>
                    {navName}
                    <i style={{ backgroundColor: styles.selectedUnderlineColor }}></i>
                </li>
            )
        } else {
            return (
                <li style={{ color: styles.fontColor }} onClick={this.handleChange}>
                    {navName}
                    <i></i>
                </li>
            )
        }
    }
}