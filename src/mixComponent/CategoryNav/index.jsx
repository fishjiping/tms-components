import './index.less';
import React from 'react';
import NavItem from './NavItem';

export default class CategoryNav extends React.Component {
    handleChangeNav = (navName) => {
        const { data, checkedNavName, onChange } = this.props;

        if (navName !== checkedNavName) {
            onChange(navName);
        }
    }

    render() {
        const { data, checkedNavName, getNavEl, styles } = this.props;

        if ( data && data.length > 0 ) {
            return (
                <div className="category-nav" ref={getNavEl} style={{ backgroundColor: styles.bgColor }}>
                    <ul>
                        {
                           data.map((navName, i) => {
                                return <NavItem key={navName} checked={navName === checkedNavName} navName={navName} styles={styles} onChangeNav={this.handleChangeNav} />;
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