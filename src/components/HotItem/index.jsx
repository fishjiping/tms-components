import Item from './item';
import TitleBar from '../../mixComponent/TitleBar';
import { getCartData } from '../../libs/cart';
import './index.less';

export default function HotItem(props) {
    const { uid, data, marginBottom, ...styles } = props;

    if( data && data.items && data.items.length > 0 ) {
        const shopcart = getCartData();
        return (
            <div id={uid} className="hot-item" style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                <ul className="list">
                    { 
                        data.items &&  data.items.map((itemData, i) => {
                            if(shopcart[itemData.id] && shopcart[itemData.id].count) {
                                itemData.cartNum = shopcart[itemData.id].count;
                            } else {
                                itemData.cartNum = 0;
                            }

                            return (<Item key={itemData.id} data={itemData} styles={styles} />)
                        })
                    }
                </ul>
            </div>
        );
    } else {
        return  <div id={uid}></div>;
    }
}