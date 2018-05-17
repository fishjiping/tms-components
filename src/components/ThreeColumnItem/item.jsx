import React, { Component } from 'react';
import { Toast } from 'antd-mobile';
import { formatprice } from '../../libs/util';
import { addCart, reduceCart, updateCart } from '../../libs/cart';

export default class Item extends Component {
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

    componentDidMount() {
        //todo： displayReload事件
    }

    render() {
        const { data, styles, hasLine } = this.props;
        const { cartNum } = this.state;

        return (
            <li className={`item ${hasLine ? 'separator-line' : ''}`}>
                {
                    data.quantity > 0
                    ? <a 
                        className="link" 
                        href={`/lianhua/detail.html?shopIds=${data.shopId}&itemId=${data.id}&page=new-app-page&tspBar=true`}
                    >
                        <img className="pic lazyload-img" data-cdn="no" data-src={`//imgsize.52shangou.com/img/${data.bigPicUrl}@210w`} src="http://imgsize.52shangou.com/img/n/10/10/60712125815618a817df46d4a41382c01c06a2031433c9506b825fc.png" />
                        <p className="title">{data.brand} {data.name} {data.property}/{data.unit}</p>
                    </a>
                    : <div className="link">
                        <img className="pic lazyload-img" data-cdn="no" data-src={`//imgsize.52shangou.com/img/${data.bigPicUrl}@210w`} src="http://imgsize.52shangou.com/img/n/10/10/60712125815618a817df46d4a41382c01c06a2031433c9506b825fc.png" />
                        <div className="item-status-wrap"><span className="item-status-text">抢光了</span></div>
                        <p className="title">{data.brand} {data.name} {data.property}/{data.unit}</p>
                    </div>
                }
                {
                    data.promotionPrice > 0 
                    ? <div className="price-box">
                        <span className="price">&yen; {formatprice({ value: data.promotionPrice / 100 })}</span>
                        { data.price !== data.promotionPrice && <span className="origin-price">&yen; <span>{formatprice({ value: data.price / 100 })}</span></span>  }
                    </div> 
                    : <div className="price-box">
                        <span className="price">&yen; {formatprice({ value: data.price / 100 })}</span>
                    </div>
                }
                {
                    data.quantity > 0 
                    ? <div className="add-cart-btn" style={{ backgroundColor: styles.btnColor }} onClick={this.handleAddItem}>立即购买</div>
                    : <div className="add-cart-btn" style={{ backgroundColor: '#ddd' }}>立即购买</div>
                }
            </li>
        );
    }
};


