/**
 * Ядро Jape
 */

(function (win,doc){
    var window = win || {};
    var document = doc || {};
    var ua = navigator.userAgent.toLowerCase();
    var isOpera = (ua.indexOf('opera')  > -1);
    var isIE = (!isOpera && ua.indexOf('msie') > -1);

    var presentations = [];
    var curentPresentation = null;

    /**
     * Обертка для выборки дом узлов
     * @param sel
     * @param el
     * @returns {NodeList}
     */
    var $ = function (sel,el){
        if (el!=undefined){
            return el.querySelectorAll(sel);
        }
        return document.querySelectorAll(sel);
    }

    /**
     * Пребор элементов колекции или массива
     * @param array
     * @param callback
     * @param scope
     */
    var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
    };

    /**
     * Класс для вывода логов
     * @type {{_getTimeStamp: _getTimeStamp, info: info, log: log}}
     */
    trace = {
        debug:true,

        _getTimeStamp: function(){
            var now = new Date();
            return '[' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds() + '] ';
        },

        /**
         * Провто вывод какой-то информации с штампом времяни
         * @returns {boolean}
         */
        info: function (){
            if (!this.debug) { return false }
            var timeStamp = this._getTimeStamp();
            if (arguments.length > 1) {
                console.log('benderlog - ' + timeStamp);
                for (var i = 0, len = arguments.length; i < len; i++) {
                    if (typeof arguments[i] === 'object') {
                        console.dir(arguments[i]);
                    } else {
                        console.log(arguments[i]);
                    }
                }
            } else if (arguments.length = 1) {
                if (typeof arguments[0] === 'object') {
                    console.log('benderlog - ' + timeStamp );
                    console.log(arguments[0]);
                } else {
                    console.log('benderlog - ' + timeStamp + arguments[0]);
                }
            }
        },

        /**
         * Вывод информации с трейслогом
         * @returns {boolean}
         */
        log:function (){
            if (!this.debug) { return false }
            var timeStamp = this._getTimeStamp();
            if (arguments.length > 1) {
                console.log('benderlog - ' + timeStamp);
                console.trace();
                for (var i = 0, len = arguments.length; i < len; i++) {
                    console.trace();
                    if (typeof arguments[i] === 'object') {
                        console.dir(arguments[i]);
                    } else {
                        console.log(arguments[i]);
                    }
                }
            } else if (arguments.length = 1) {
                if (typeof arguments[0] === 'object') {
                    console.log('benderlog - ' + timeStamp );
                    console.trace();
                    console.dir(arguments[0]);
                } else {
                    console.log('benderlog - ' + timeStamp + arguments[0]);
                    console.trace();
                }


            }
        }
    }


    /**
     * Основоной класс презентации
     * @param el    - обект <presentation>
     */
    window.jape = function (el){
        this.elem = el;
        this.slides = {};
        this.state = 'normal';
        this.curentSlide = null;
        this.fullscreenSize = utils.getSlideSize();
        trace.info(this.fullscreenSize);
    }

    jape.prototype = {
        /**
         * Инициализация презентации
         */
        init: function (){
            that = this;
            trace.info('Инициализация презентации');
            this.slides = $('section',this.elem);
            forEach(this.slides,function(){

            })

            // На первый слайд вешаем клик который развернет презентацию на полный экран
            this.slides[0].addEventListener('click',function (e){
                that.start.call(that);

            });
        },

        showSlide: function(id){
            if ( (id < this.slides.length) && (id>=0) ){
                var slide = this.slides[id];
                slide.classList.add('active');
                this.curentSlide = id;
            }
        },

        hideSlide: function(id){
            var slide = this.slides[id];
            slide.classList.remove('active');
        },

        next:function (){
            if (this.state == 'full') {
                this.hideSlide(this.curentSlide);
                this.showSlide(this.curentSlide + 1);
            }
        },

        previous:function (){
            if (this.state == 'full') {
                this.hideSlide(this.curentSlide);
                this.showSlide(this.curentSlide - 1);
            }
        },

        start: function(){
            curentPresentation = this.elem['data-id'];
            var d = that.fullscreenSize[1]/640;
            this.elem.style.transform = 'scale('+d+')';
            this.elem.classList.add('full');
            this.elem.classList.remove('list');
            trace.info(this.state);
            if (this.state == 'normal'){

                this.showSlide(0);
                this.state = 'full';
            }
        },

        stop:function (){
            this.elem.classList.remove('full');
            this.elem.classList.add('list');
            that.elem.style.transform = 'none';
            this.state = 'normal';
        }


    }

    utils = {
        getSlideSize: function (){
            var out = [0,0];
            var size = this.getPageSize();
            var d = 16/10;
            var ds = size[0]/size[1];
            if (ds>1){
                out[0] = Math.ceil(size[1]*d);
                out[1] = size[1];
            } else {
                out[0] = size[0];
                out[1] = Math.ceil(size[0]*d);
            }
            return out;
        },

        getPageSize:function (){
            pageHeight = this._getDocumentHeight();
            pageWidth = this._getDocumentWidth();
            windowHeight = this._getViewportHeight();
            windowWidth = this._getViewportWidth();
            return [pageWidth,pageHeight,windowWidth,windowHeight];
        },

        _getDocumentHeight:function () {
            return Math.max(document.compatMode != 'CSS1Compat' ? document.body.scrollHeight : document.documentElement.scrollHeight, this._getViewportHeight());
        },

        _getViewportHeight: function () {
            return ((document.compatMode || isIE) && !isOpera) ? (document.compatMode == 'CSS1Compat') ? document.documentElement.clientHeight : document.body.clientHeight : (document.parentWindow || document.defaultView).innerHeight;
        },

        _getDocumentWidth: function () {
            return Math.max(document.compatMode != 'CSS1Compat' ? document.body.scrollWidth : document.documentElement.scrollWidth, this._getViewportWidth());
        },

        _getViewportWidth: function () {
            return ((document.compatMode || isIE) && !isOpera) ? (document.compatMode == 'CSS1Compat') ? document.documentElement.clientWidth : document.body.clientWidth : (document.parentWindow || document.defaultView).innerWidth;
        }

    }


    /**
     * Событие готовности страницы
     */
    window.addEventListener('DOMContentLoaded', function (){
        trace.info(utils.getPageSize());
        var list  = document.querySelectorAll('presentation');
        if (list.length > 0){
            for (var i= 0,cnt = list.length;i<cnt;i++){
                presentations.push(new jape(list[i]))
                presentations[i].init();
                list[i]['data-id'] = i;
            }
        }
    });

    /**
     * Нажатия кнопок клавы
     */
    window.addEventListener('keyup',function (e){
        var key = e.keyCode;
        switch (e.which) {
            case 27:
                var pr = presentations[curentPresentation];
                pr.stop();

            break;
            case 32:
                var pr = presentations[curentPresentation];
                pr.next();
            break;
        }
    })

    /**
     * Событие скрола мышки
     */
    if ('onwheel' in document) {
        window.addEventListener ("wheel", onWheel, false);
    } else if ('onmousewheel' in document) {
        window.addEventListener ("mousewheel", onWheel, false);
    } else {
        window.addEventListener ("MozMousePixelScroll", onWheel, false);
    }

    function onWheel(e){
        e = e || window.event;
    }

})(window,document);
