import './index.less';
import React from 'react';
import ItemLR from '../ItemLR';
import ItemTB from '../ItemTB';
import ThreeColumnItem from '../ThreeColumnItem';
import Sticky from '../../mixComponent/Sticky';
import CategoryNav from '../../mixComponent/CategoryNav';
import { throttle, changeScrollTop } from '../../libs/util';

export default class ItemCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedNavName: '',
            navList: [],
            itemList: []
        }
        this.pannelNodeList = [];
        this.pannelOffsetTopList = [];
        this.disableSwitchNav = false;
    }

    handleChangeNav = (navName) => {
        this.setState({ 
            checkedNavName: navName
        });

        const { navList } = this.state;
        const index = navList.indexOf(navName);
        let offsetTop = this.pannelOffsetTopList[index];

        if (!offsetTop) {
            const scrollTop = window.scrollY;
            this.pannelNodeList.forEach((el, i) => {
                const rect = this.pannelNodeList[i].getBoundingClientRect();
                this.pannelOffsetTopList[i] = scrollTop + rect.top - this.navHeight;
                if (i === index) {
                    offsetTop = this.pannelOffsetTopList[i];
                }
            });
        }

        this.disableSwitchNav = true;
        changeScrollTop({ 
            distance: offsetTop,
            callback: () => {
                this.disableSwitchNav = false;
            }
        });
    }

    componentDidMount() {
        const scrollEvent = throttle(() => {
            if (this.disableSwitchNav) return;
            const { navList, checkedNavName } = this.state;
            const scrollTop = window.scrollY;
            let index = 0;

            if (this.pannelOffsetTopList.length === 0) {
                this.pannelNodeList.forEach((el, i) => {
                    const rect = this.pannelNodeList[i].getBoundingClientRect();
                    this.pannelOffsetTopList[i] = scrollTop + rect.top - this.navHeight;
                });
            }

            for (let i = 0, len = this.pannelOffsetTopList.length; i < len; i++) {
                if (parseInt(scrollTop) < parseInt(this.pannelOffsetTopList[i])) {
                    if (i === 0) {
                        index = 0;
                    } else {
                        index = i - 1;
                    }
                    break;
                } else if (i === len - 1) {
                    index = i;
                }
            }

            if (navList.indexOf(checkedNavName) !== index) {
                this.setState({ checkedNavName: navList[index] });
            }
            
        }, 100);
        window.addEventListener('scroll', scrollEvent, false);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && this.props.data !== nextProps.data) {
            const navList = this.getNavList(nextProps.data.items);
            const itemList = this.getItemList(nextProps.data.items, navList);
            this.setState({ 
                checkedNavName: navList[0],
                navList,
                itemList
            });
        }
    }

    getNavList(itemList) {
        if (!itemList) return [];

        let navList = itemList.map((item) => {
            return {
                tagName: item.tagName,
                tagSortNum: item.tagSortNum
            };
        });

        // 按分组序号排序，数值大的排在前面
        navList.sort((a, b) => {
            return b.tagSortNum - a.tagSortNum;
        });

        navList = navList.map((item) => {
            return item.tagName;
        });

        // 去重
        navList = Array.from(new Set(navList));

        return navList;
    }

    getItemList(itemList, navList) {
        if (itemList) {
            let list = [];
            navList.forEach((navName, i) => {
                let data = { navName, items: [] };
                itemList.forEach((item, j) => {
                    if (item.tagName === navName) {
                        data.items.push(item);
                    }
                });
                list.push(data);
            });
            return list;
        } else {
            return [];
        }
    }

    getNavEl = (el) => {
        this.navEl = el.querySelector('ul');
        this.navHeight = el.getBoundingClientRect().height;
    }

    render() {
        const { 
            uid, 
            arrangementMode, 
            data, 
            marginBottom, 
            ...styles 
        } = this.props;
        const { 
            checkedNavName, 
            navList, 
            itemList
        } = this.state;

        if ( navList.length > 0 ) {
            return (
                <div className="item-category" id={uid} style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                    <Sticky style={{ top: 0, zIndex:300 }}>
                        <CategoryNav 
                            data={navList} 
                            checkedNavName={checkedNavName} 
                            styles={styles} 
                            getNavEl={this.getNavEl}
                            onChange={this.handleChangeNav} 
                        />
                    </Sticky>
                    <div className="category-content">
                        {
                            itemList.map((item, i) => {
                                return (
                                    <div key={item.navName} className="category-pannel" ref={(el) => { this.pannelNodeList.push(el); }}>
                                        <h3>{item.navName}</h3>
                                        {
                                            arrangementMode === 'lr' 
                                            ? <ItemLR data={item} {...styles} /> 
                                            : arrangementMode === 'tb' 
                                                ? <ItemTB data={item} {...styles} />
                                                : <ThreeColumnItem data={item} {...styles} />
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            );
        } else {
            return <div id={uid}></div>;
        }
    }
}