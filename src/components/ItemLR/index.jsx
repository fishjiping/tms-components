import Item from './item';
import moment from 'moment';
import { formatCountDown } from '../../libs/util';
import TitleBar from '../../mixComponent/TitleBar';
import { getCartData } from '../../libs/cart';
import './index.less';

export default function ItemLR(props) {
    const { 
        uid, 
        data, 
        title, 
        subTitle,
        itemType, 
        btnText,
        currentTime,
        notStartBtnColor,
        processBtnColor,
        finishedBtnColor,
        notStartBtnFontColor,
        processBtnFontColor,
        finishedBtnFontColor,
        marginBottom,
        ...styles 
    } = props;
    let hasLine = false;

    if (window.getComputedStyle(document.body).backgroundColor === 'rgb(255, 255, 255)') {
        hasLine = true;
    }

    function presellConfig (actStartDate, actEndDate) {
        const startTime = moment(`${actStartDate} 00:00:00`).valueOf();
        const endTime = moment(`${actEndDate} 23:59:59`).valueOf();

        if (startTime > currentTime) {
            return {
                countDown: Object.assign({ text: '距开始' }, formatCountDown(currentTime, startTime)),
                itemBtn: {
                    btnText: '即将开始',
                    btnColor: notStartBtnColor,
                    btnFontColor: notStartBtnFontColor
                }
            };
        } else if (startTime <= currentTime && endTime > currentTime) {
            return {
                countDown: Object.assign({ text: '距结束' }, formatCountDown(currentTime, endTime)),
                itemBtn: {
                    btnText: '立即预订',
                    btnColor: processBtnColor,
                    btnFontColor: processBtnFontColor
                }
            };
        } else {
            return {
                countDown: {
                    text: '已结束',
                    day: '00',
                    hour: '00',
                    minute: '00',
                    second: '00'
                },
                itemBtn: {
                    btnText: '已结束',
                    btnColor: finishedBtnColor,
                    btnFontColor: finishedBtnFontColor
                }
            };
        }

        return config;
    }

    if( data && data.items && data.items.length > 0 ) {
        const shopcart = getCartData();
        return (
            <div id={uid} className="item-lr" style={{ marginBottom: marginBottom ? `${marginBottom / 100}rem`: 0 }}>
                {title && <TitleBar mainText={title} subText={subTitle} styles={styles} />}
                <ul className="list">
                    { 
                        data.items &&  data.items.map((itemData, i) => {
                            if (shopcart[itemData.id] && shopcart[itemData.id].count) {
                                itemData.cartNum = shopcart[itemData.id].count;
                            } else {
                                itemData.cartNum = 0;
                            }

                            if (itemType === 'multiplePresell') {
                                const config = presellConfig(itemData.actStartDate, itemData.actEndDate);
                                return (
                                    <Item 
                                        key={itemData.id} 
                                        data={itemData} 
                                        itemType="presale"
                                        hasCountDown
                                        countDownConfig={config.countDown}
                                        btnText={config.itemBtn.btnText} 
                                        hasLine={hasLine} 
                                        styles={Object.assign({ btnColor: config.itemBtn.btnColor, btnFontColor: config.itemBtn.btnFontColor }, {...styles})} 
                                    />
                                );
                            } else {
                                return (
                                    <Item 
                                        key={itemData.id} 
                                        data={itemData} 
                                        itemType={itemType}
                                        btnText={btnText}
                                        hasLine={hasLine}  
                                        styles={styles} 
                                    />
                                );   
                            }
                        })
                    }
                </ul>
            </div>
        );
    } else {
        return  <div id={uid}></div>;
    }
}