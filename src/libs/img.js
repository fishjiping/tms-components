import { throttle } from './util';

function extend(target, obj) {
    var result = {};
    for (var k in target) {
        if (target.hasOwnProperty(k)) {
            result[k] = target[k];
        }
    }
    for (var k2 in obj) {
        if (obj.hasOwnProperty(k2)) {
            result[k2] = obj[k2];
        }
    }
    return result;
}

function getOffset(obj, param) {
    if (!obj) obj = window;
    if (!param) param = {x: 0, y: 0};

    if (obj != window) {
        var el = obj.getBoundingClientRect();
        return {
            'left': el.left,
            'top': el.top,
            'right': el.right + param.x,
            'bottom': el.bottom + param.y
        };
    } else {
        if (!winOffset) {
            winOffset = {
                'left': 0,
                'top': 0,
                'right': obj.innerWidth + param.x,
                'bottom': obj.innerHeight + param.y
            };
        }
        return winOffset;
    }
}

//元素位置比较
function compareOffset(d1, d2) {
    var left = d2.right >= d1.left && d2.left <= d1.right;
    var top = d2.bottom >= d1.top && d2.top <= d1.bottom;
    return left && top;
}

// 判断是否支持webp格式
function check_webp_feature(callback) {
    try {
        if (localStorage.getItem('webp') === 'true') {
            callback(true);
        } else {
            var img = new Image();
            img.onload = function () {
                var result = (img.width > 0) && (img.height > 0);
                localStorage.setItem('webp', result);
                callback(result);
                img.onload = img.onerror = null;
            };
            img.onerror = function () {
                localStorage.setItem('webp', false);
                callback(false);
                img.onload = img.onerror = null;
            };
            img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        }
    } catch (e) {
        localStorage.setItem('webp', false);
        callback(false);
    }
}

var winOffset;

//配置参数
var defaultConfig = {
    // 'container':document,// 懒加载容器，默认window
    'class': 'lazyload-img',// img元素class名称
    'dataSrc': 'data-src',
    'q': '90q',//图片质量,
    'size': '',// cdn尺寸
    'sharpen': '',// 锐化参数
    'lazyHeight': 0,
    'lazyWidth': 0,
    'fireEvent': 'scroll',// 触发懒加载的事件, 默认scroll事件
    'webp': true// 是否使用webp格式（支持webp则使用webp格式）,默认使用webp
};

function imgHelper (options) {
    var self = this;
    self.config = extend(defaultConfig, options || {});
    self.config.class = self.config.class.charAt(0) !== '.' ? self.config.class : self.config.class.slice(1);
    if (self.config.webp) {
        check_webp_feature(function (isSupportWebP) {
            self.config.webp = isSupportWebP;
            self.config.checkWebP = true;
            self._init(options);
        });
    } else {
        self._init(options);
    }
}

imgHelper.prototype._init = function () {
    if (this.config.fireEvent === 'scroll') {
        this.bindLazyEvent();
    }
};

imgHelper.prototype.fireLazyload =  function () {
    var self = this;
    if (self.config.webp && !self.config.checkWebP) {
        check_webp_feature(function (isSupportWebP) {
            self.config.webp = isSupportWebP;
            self.config.checkWebP = true;
            self._loadImg();
        });
    } else {
        self._loadImg();
    }
};

//绑定懒加载所需的事件
imgHelper.prototype.bindLazyEvent = function () {
    var self = this;
    var opts = self.config;
    var scrollHandler = throttle(self._loadImg, 100);
    var resizeHandler = throttle(function () {
        winOffset = null;
        winOffset = getOffset(window, {
            'x': opts.lazyWidth,
            'y': opts.lazyHeight
        })
    }, 100);
    var container = opts.container || window;
    container.addEventListener('scroll', function (){
        scrollHandler.call(self);
    }, false);

    if (container === window) {
        container.addEventListener('resize', function (){
            resizeHandler.call(self);
        }, false);
    }
};

//加载可视区域内的 懒加载图
imgHelper.prototype._loadImg = function () {
    var self = this;
    var opts = self.config;
    var container = opts.container || document;
    var srcAttr = opts.dataSrc;
    var lazyImgs = Array.prototype.slice.call(container.querySelectorAll('.' + opts.class + '[' + srcAttr + ']'));
    var loadingImgs = Array.prototype.slice.call(container.querySelectorAll('.' + opts.class + '[data-loading="true"]'));
    var currentTime = Date.now();
    winOffset = getOffset(window, {
        'x': opts.lazyWidth,
        'y': opts.lazyHeight
    });
    // 加载超时的重新加载
    if (loadingImgs) {
        loadingImgs.forEach(function (el, index) {
            var loadStartTime = el.getAttribute('data-time');
            loadStartTime = loadStartTime ? parseInt(loadStartTime) : 0;
            if (currentTime - loadStartTime > 20000) {
                el.removeAttribute('data-loading');
                el.removeAttribute('data-time');
            }
        });
    }
    if (lazyImgs.length) {
        lazyImgs.forEach(function (el, index) {
            var dataSrc = el.getAttribute(srcAttr);
            var isLoading = el.getAttribute('data-loading');
            if (dataSrc && isLoading !== 'true') {
                var elOffset = getOffset(el);
                var isInViewport = compareOffset(winOffset, elOffset);
                if (isInViewport) {
                    dataSrc = self.getBestImgUrl(dataSrc, el);
                    el.setAttribute('data-loading', 'true');
                    el.setAttribute('data-time', currentTime);
                    self.preloadImg(dataSrc, function () {
                        el.removeAttribute(srcAttr);
                        el.removeAttribute('data-loading');
                        el.removeAttribute('data-time');
                        if (el.tagName === 'IMG') {
                            el.setAttribute('src', dataSrc);
                        } else {
                            //非图片元素设置其backgroundImage为真实src
                            el.style.backgroundImage = 'url(' + dataSrc + ')';
                        }
                        //if (opts.removeLazyLoadClass) el.className = el.className.replace(new RegExp('(^|\\s)' + opts.class + '(\\s|$)'), '');
                    }, function () {
                        el.removeAttribute('data-loading');
                        el.removeAttribute('data-time');
                        //if (opts.removeLazyLoadClass) el.className = el.className.replace(new RegExp('(^|\\s)' + opts.class + '(\\s|$)'), '');
                    });
                }
            }
        });
    }
};

/**
 * 获取优化的cdn图片
 * @param url {String} 图片地址
 * @param el {Element} 图片节点
 * @returns {String} cdn图片链接
 */
imgHelper.prototype.getBestImgUrl = function (url, el) {
    var suffer;
    var size;
    var quality;
    var width;
    var height;
    var imgSize;
    var opts = this.config;
    var imgServer = [];

    url = url.replace(/\?.*/, '');

    // 判断图片后缀
    if (opts.webp) {
        suffer = '.webp';
    } else {
        suffer = url.match(/\.(jpeg|jpg|png|gif|webp)/g);
        suffer = suffer ? suffer[0] : '.jpg';
    }

    if (el) {
        size = el.getAttribute('data-size') || '';
        quality = el.getAttribute('data-quality') || opts.q;
    }

    // 获取图片缩放尺寸
    if (size) {
        imgSize = (size !== 'no') ? size.split('x') : [];
    } else {
        imgSize = opts.size ? opts.size.split('x') : [];
    }
    width = (imgSize[0] && !isNaN(imgSize[0]) && imgSize[0] !== '0') ? imgSize[0] : 0;
    height = (imgSize[1] && !isNaN(imgSize[1]) && imgSize[1] !== '0') ? imgSize[1] : 0;

    if (url.indexOf('@') === -1) {
        // 宽度缩放
        if (width) {
            imgServer.push(width + 'w');
        }
        // 高度缩放
        if (height) {
            imgServer.push(height + 'h');
        }

        // 只支持jpg、jpeg等格式质量和锐化，webp、png格式质量和锐化反而文件变大，故去掉
        if (suffer === '.jpg' || suffer === '.jpeg') {
            // 图片质量
            if (quality) {
                imgServer.push(quality);
            }
            // 图片锐化
            if (opts.sharpen) {
                imgServer.push(opts.sharpen);
            }
        }
        return url + '@' + imgServer.join('_') + suffer;
    } else {
        var params = url.split('@')[1];
        var imgServerStr = '';
        // 宽度缩放
        if (width && !params.match(/(^|\||_)\d+w/)) {
            imgServer.push(width + 'w');
        }
        // 高度缩放
        if (height && !params.match(/(^|\||_)\d+h/)) {
            imgServer.push(height + 'h');
        }

        // 只支持jpg、jpeg等格式质量和锐化，webp、png格式质量和锐化反而文件变大，故去掉
        if (suffer === '.jpg' || suffer === '.jpeg') {
            // 图片质量
            if (quality && !params.match(/(^|\||_)\d+(q|Q)/)) {
                imgServer.push(quality);
            }
            // 图片锐化
            if (opts.sharpen  && !params.match(/(^|\||_)\d+sh/)) {
                imgServer.push(opts.sharpen);
            }
        }

        if (imgServer.length) {
            if (params.replace(/\.\w*$/, '')) {
                if (params.match(/watermark/)) {
                    imgServerStr = imgServer.join('_') + suffer;
                } else {
                    imgServerStr = '_' + imgServer.join('_') + suffer;
                }
            } else {
                imgServerStr = imgServer.join('_') + suffer;
            }
        } else {
            imgServerStr = suffer;
        }

        if (url.match(/\.\w*$/)) {
            url = url.replace(/\.\w*$/, imgServerStr);
        } else {
            if (url.match(/watermark/)) {
                url = url.replace(/(@|\|)watermark/, function ($1, $2) {
                    if ($2 === '@') {
                        return '@' + imgServerStr + '|watermark'
                    } else {
                        return '_' + imgServerStr + '|watermark'
                    }
                })
            } else {
                url = url + imgServerStr;
            }
        }

        // 只支持jpg、jpeg等格式质量和锐化，webp、png格式质量和锐化反而文件变大，故去掉
        if (suffer === '.jpg' || suffer === '.jpeg') {
            return url.replace(/_{2,}/g, '_')
                .replace(/_(\||\.)/g, '$1')
                .replace(/(@|\|)(_|\|)/g, '$1');
        } else {
            return url.replace(/(@|\||_)\d+(q|Q)(_)?/g, '$1')
                .replace(/(@|\||_)\d+sh(_)?/g, '$1')
                .replace(/_{2,}/g, '_')
                .replace(/_(\||\.)/g, '$1')
                .replace(/(@|\|)(_|\|)/g, '$1');
        }
    }
};


/**
 * 加载大图
 * @param url {String} 图片链接
 * @param success {Function} 成功回调函数
 * @param error {Function} 失败回调函数
 */
imgHelper.prototype.preloadImg = function (url, success, error) {
    var img = new Image();
    img.onload = function () {
        success && success();
        img.onload = img.onerror = null;
    };
    img.onerror = function () {
        error && error();
        img.onload = img.onerror = null;
    };
    img.src = url;
    // 如果图片已经存在于浏览器缓存，直接调用回调函数
    if (img.complete) {
        success && success();
        img.onload = img.onerror = null;
    }
};

export default imgHelper;