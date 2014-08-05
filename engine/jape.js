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

            // На первый слайд вешаем клик который развернет презентацию на полный экран
            this.slides[0].addEventListener('click',function (e){
                var el = e.currentTarget || e.target;
                curentPresentation = el.parentNode['data-id'];
                that.showSlide(0);
                that.state = 'full';
            });
        },

        showSlide: function(id){
            var slide = this.slides[id];

            slide.style.width = this.fullscreenSize[0]+'px';
            slide.style.height = this.fullscreenSize[1]+'px';
            slide.style.marginLeft = '-'+Math.round(this.fullscreenSize[0]/2)+'px';
            utils.addClass(slide,'full');
            this.curentSlide = id;
        },

        hideSlide: function(id){
            var slide = this.slides[id];
            utils.removeClass(slide,'full');
            slide.style.width = '480px';
            slide.style.height = '360px';
            slide.style.marginLeft = '0';
            if (id != 0){
                this.hideSlide(0);
            }
        }
    }

    utils = {

        addClass:function(el,cl){
            el.className += ' '+cl;
        },

        removeClass:function(el,cl){
            el.className = el.className.replace(cl,'');
        },

        getSlideSize: function (){
            var out = [0,0];
            var size = this.getPageSize();
            var d = 1.333333;
            size[1]-=40;
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

    function  getPageSize(){

    }




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

    window.addEventListener('keyup',function (e){
        var key = e.keyCode;
        switch (e.which) {
            case 27:
                var pr = presentations[curentPresentation];
                pr.hideSlide(pr.curentSlide);

            break;
        }
    })

})(window,document);
