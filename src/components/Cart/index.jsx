import './index.less';
import React from 'react';
import env from '../../libs/env';
import eventBus from '../../libs/eventBus.js';

export default class Cart extends React.Component {
    constructor(props) {
        super(props);
        this.state =  { cartNum: this.cartNum }
    }

    handleGoCart = () => {
        if(env.inWeiChat) {
            instance.showTipLayer();
        }else{
            GlobalCart.goCartPage();
        }
    }

    handleUpdateCartCount = () => {
        this.setState({
            cartNum: this.cartNum
        });
    }

    componentDidMount() {
        eventBus.add('updateCartNum', this.handleUpdateCartCount);
    }

    get cartNum() {
        const carts = GlobalCart.getCartData() || {};
        let cartNum = 0;
        // let carts = {};

        // if (shopcarts != null) {
        //     try {
        //         carts = JSON.parse(shopcarts);
        //     } catch (e) {
        //         console.log('getCartDataError', e.message);
        //         carts = shopcarts;
        //     }
        // }

        for( let id in carts ) {
            const cart = carts[id];
            if (cart !== null && typeof cart === "object") {
                cartNum += cart.count;
            }
        }
        return cartNum;
    }

    render() {
        const { cartNum } = this.state;
        
        return (
            <div className="cart" onClick={this.handleGoCart}>
                <span className="cart-number" style={{ visibility: cartNum === 0 ? 'hidden' : 'visible' }}>{cartNum}</span>
            </div>
        )
    }
}
