import eventBus from './eventBus';

/**
 * item 商品信息的object
 * callback 执行完毕的callback
 */
const addCart = function (payload) {
	let item = payload.item;
	let cartNum = item && item.cartNum || 0;
	let callback = payload.callback;
	let itemId = payload.itemId;
	if(item.orderLimit > 0 && cartNum < item.orderLimit) {
		cartNum = item.orderLimit;
	}else {
		cartNum++;
	}

	if(cartNum > item.quantity) {
		callback && callback({
			status:false,
			message:"库存不足"
		});

		return;
	}

	if((item.buylimit && cartNum > item.buylimit) || item.cartNum > 999) {

		callback && callback({
			status:false,
			message:"抱歉，已超过购买上限，先挑点别的吧~"
		});

		return;
	}

	GlobalCart.setItem(itemId || item.id, item.shopId, cartNum);
	callback && callback({
		status:true,
		data:{
			id: itemId || item.id,
			cartNum: cartNum
		}
	});
}

const reduceCart = function (payload) {
	let item = payload.item;
	let cartNum = item && item.cartNum || 0;
	let itemId = payload.itemId;
	let callback = payload.callback;

	// 最小起订量逻辑处理
	if (item.orderLimit > 0 && cartNum <= item.orderLimit) {
		cartNum = 0;
	} else {
		if(cartNum > 0){
			cartNum --;
		}
	}

	// 最小起订量逻辑处理-end
	GlobalCart.setItem(itemId || item.id, item.shopId, cartNum);
	callback && callback({
		status: true,
		data: {
			id:itemId || item.id,
			cartNum: cartNum
		}
	});
}

const updateCart = function (payload) {
	eventBus.dispatch('updateCartNum');
}

const getCartCount = function () {
	return window.GlobalCart && window.GlobalCart.getCount();
}

const getCartData = function () {
	return window.GlobalCart && window.GlobalCart.getCartData() || {}
}

export {
	addCart,
	reduceCart,
	updateCart,
	getCartCount,
	getCartData
}