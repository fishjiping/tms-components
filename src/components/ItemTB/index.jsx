import Item from './item';
import TitleBar from '../../mixComponent/TitleBar';
import { getCartData } from '../../libs/cart';
import './index.less';

export default function ItemTB(props) {
    const { 
        uid, 
        data, 
        title, 
        subTitle, 
        marginBottom, 
        ...styles 
    } = props;
    let hasLine = false;

    if (window.getComputedStyle(document.body).backgroundColor === 'rgb(255, 255, 255)') {
        hasLine = true;
    }

    if( data && data.items && data.items.length > 0 ) {
        const shopcart = getCartData();
        return (
            <div id={uid} className="item-tb" style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                {title && <TitleBar mainText={title} subText={subTitle} styles={styles} />}
                <ul className="list">
                    { 
                        data.items &&  data.items.map((itemData, i) => {
                            if(shopcart[itemData.id] && shopcart[itemData.id].count) {
                                itemData.cartNum = shopcart[itemData.id].count;
                            } else {
                                itemData.cartNum = 0;
                            }

                            return (<Item key={itemData.id} data={itemData} styles={styles} hasLine={hasLine} />)
                        })
                    }
                </ul>
            </div>
        );
    } else {
        return  <div id={uid}></div>;
    }
}