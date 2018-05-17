import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import { addCart, reduceCart, updateCart, getCartCount, getCartData } from '../../libs/cart';
import { formatprice } from '../../libs/util';

export default class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cartNum: props.data.cartNum
        };
    }

    handleAddItem = (e) => {
        const { data } = this.props;
        addCart({
            item: Object.assign(data, { cartNum: this.state.cartNum }),
            itemId: data.id,
            callback: (payload) => {
                if(payload && payload.status) {
                    updateCart();
                    this.setState({ cartNum: payload.data.cartNum });
                } else {
                    Toast.fail(payload.message || '加购失败！');
                }
            }
        });
    }

    handleReduceItem = (e) => {
        e.stopPropagation();
        const { data } = this.props;
        reduceCart({
            item: Object.assign(data, { cartNum: this.state.cartNum }),
            itemId: data.id,
            callback: (payload) => {
                if(payload && payload.status) {
                    updateCart();
                    this.setState({ cartNum: payload.data.cartNum });
                } else {
                    Toast.fail(payload.message || '减购失败！');
                }
            }
        });
    }

    componentDidMount() {
        //todo： displayReload事件
    }

    render() {
        const { data, styles } = this.props;
        const { cartNum } = this.state;
        let btnClass = 'btnarea';

        // count=0时btn样式，>0则是加号
        if (!cartNum) {
            btnClass = 'btnarea btnStyle';
        }

        return (
            <li className="item" style={{backgroundColor: styles.bgColor}}>
                <div className="img">
                    <a 
                        className="link" 
                        href={`/lianhua/detail.html?shopIds=${data.shopId}&itemId=${data.id}&page=new-app-page&tspBar=true`}
                    >
                        <img className="pic lazyload-img" data-cdn="no" data-src={`//imgsize.52shangou.com/img/${data.bigPicUrl}@300w`} src="http://imgsize.52shangou.com/img/n/10/10/60712125815618a817df46d4a41382c01c06a2031433c9506b825fc.png" />
                        {data.itemHotIcon && <img className="icon" src={data.itemHotIcon} />}
                    </a>
                    {data.quantity <= 0 && <div className="item-status-wrap"><span className="item-status-text">抢光了</span></div>}
                </div>
                <div className="detail">
                    <a href={`/lianhua/detail.html?shopIds=${data.shopId}&itemId=${data.id}&page=new-app-page&tspBar=true`}>
                        <p
                            className="title" 
                            style={{ color: styles.nameColor }}
                        >{data.brand} {data.name} {data.property}/{data.unit}</p>
                        <p className="desc" style={{ color: styles.descColor }}>{data.subTitle || ''}</p>
                    </a>
                    <div className="price-box">
                        {
                            data.promotionPrice > 0 ?
                            <div>
                                <span className="price"><i>&yen;</i>{formatprice({ value: data.promotionPrice / 100 })}</span>
                                {
                                    data.price !== data.promotionPrice ? 
                                    <span className="origin-price"><i>&yen;</i><span>{formatprice({ value: data.price / 100 })}</span></span> :
                                    <span></span>
                                }
                            </div> :
                            <span className="price"><i>&yen;</i> {formatprice({ value: data.price / 100 })}</span>
                        }
                    </div>
                    {
                        data.quantity > 0 && (cartNum ?
                        <div className={btnClass} style={{ backgroundColor: styles.addBtnBgColor }} onClick={this.handleAddItem}>
                            <div className="absshow">
                                <div className="absmove">
                                    <div className="btnareareduce" onClick={this.handleReduceItem}></div>
                                    <div className="cartnum">{cartNum}</div>
                                </div>
                            </div>
                        </div> :
                        <div className={btnClass} style={{ backgroundColor: styles.addBtnBgColor, color: styles.color  }} onClick={this.handleAddItem}>立即加购<i className="arrow" style={{ borderLeftColor : styles.color }}></i></div>)
                    }
                </div>
            </li>
        );
    }
};