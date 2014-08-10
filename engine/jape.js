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
            callback.call(scope, i, array[i]);
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
                        console.log(arguments[i]);
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
        this.animateList = null;
        this.curentAnim = -1;
        this.showList = [];
        this.state = 'normal';
        this.curentSlide = null;
        trace.info(this.fullscreenSize);
    }

    jape.prototype = {
        /**
         * Инициализация презентации
         */
        init: function (){
            var body = document.querySelector('body');
            body.setAttribute('data-click', 'locked');
            var that = this;
            trace.info('Инициализация презентации');
            var slides = $('section',this.elem);

            forEach(slides,function (id,val){
                var t = $('.next',val);
                if (t != null && t.length>0){
                    var uid = utils.getUID();
                    val['id']= uid;
                    val['data-next-parent'] = '1';
                }
                val['data-slide-id']=id;
                val.addEventListener('click',function (e){
                    var t = e.currentTarget['data-slide-id']
                    that.start.call(that,t);
                    trace.info('click '+t);
                });
                this.showList.push(val);
            },this);
            //todo:избавиться от этого цикла
            forEach(this.showList,function(id,item){
                item['data-slideid'] = id;
            });
            trace.info(this.showList);

            // На первый слайд вешаем клик который развернет презентацию на полный экран
            trace.info(this.showList[0]);

        },

        showSlide: function(id,direction){
            direction = direction || 'forward';
            var showList = this.showList;

            if (id < showList.length && id>=0){
                var slide = showList[id];
                slide.classList.add('active');
                slide.classList.remove('visited');
                if (slide['data-next-parent']!= null){
                    this.animateList = $('.next',slide);
                    if (this.animateList.length > 0){
                        this.curentAnim = -1;
                    }
                }
                this.curentSlide = id;
                $('.progress .bar',document)[0].style['width'] = Math.round(this.curentSlide/(this.showList.length-1)*100)+'%';
            } else {
                this.curentSlide = this.showList.length;
            }

        },

        showAnum:function (id){
            var aimateList = this.animateList;
            if (id < aimateList.length && id>=0){
                var slide = aimateList[id];
                slide.classList.add('active');
                slide.classList.remove('visited');
                this.curentAnim = id;
                $('.progress .bar',document)[0].style['width'] = Math.round(this.curentSlide/(this.showList.length-1)*100)+'%';
                if (id == aimateList.length-1){
                    this.animateList = null;
                    this.curentAnim = -1;
                }
            }
        },

        hideSlide: function(id,direction){
            direction = direction || 'forward';
            var showList = this.showList,
                slide = showList[id];
            if (slide != undefined) {
                slide.classList.remove('active');
                slide.classList.add('visited');
            }
            trace.info('hide '+id);
        },

        next:function (){
            if (this.state == 'full') {
                if (this.animateList != null){
                    this.showAnum(this.curentAnim+1);
                }  else {
                    this.hideSlide(this.curentSlide,'forward');
                    this.showSlide(this.curentSlide + 1,'forward');
                }
            }
        },

        previous: function (){
            if (this.state == 'full') {
                if (this.animateList != null){
                    this.animateList = null;
                    this.curentAnim = -1;
                    this._normaliazeHideAnim(this.curentSlide);
                }
                this.hideSlide(this.curentSlide,'back');
                this.showSlide(this.curentSlide - 1,'back');
            }
        },

        start: function(id){
            id = id || 0;
            curentPresentation = this.elem['data-id'];

            this.applyScale(utils.getScale());
            this.elem.classList.add('full');
            this.elem.classList.remove('list');
            if (this.state == 'normal'){

                this.showSlide(id);
                this.state = 'full';
            }
            document.body.classList.add('offScroll');



            $('.progress',document)[0].style['visibility']='visible';
            $('.progress .bar',document)[0].style['width'] = '0';

        },

        stop:function (){
            this.elem.classList.remove('full');
            this.elem.classList.add('list');
            this.applyScale('none');
            this.state = 'normal';
            document.body.classList.remove('offScroll');
            var body = document.querySelector('body');
            this._normalizeHideSlides();
            this._normaliazeHideAnimAll();
            $('.progress',document)[0].style['visibility']='hidden';
        },

        applyScale:function(val){
            that = this;
            forEach(
                [
                    'WebkitTransform',
                    'MozTransform',
                    'msTransform',
                    'OTransform',
                    'transform'
                ],
                function (id,item){
                    that.elem.style[item] = val;
                }
            )
        },

        _getPrevious: function (id,direction){
            return direction == 'forward' ? id-1:id+1;
        },

        _normaliazeHideAnim: function(id){
            var slide = this.showList[id],
                nexts = $('.next',slide);
            forEach(nexts,function(id,item){
                item.classList.remove('active');
            });
        },

        _normaliazeHideAnimAll:function(){
            var nexts = $('.next',this.elem);
            forEach(nexts,function(id,item){
                item.classList.remove('active');
            });
        },

        _normalizeHideSlides:function (){
            var slides = this.showList;
            forEach(slides,function (id,val){
                val.classList.remove('active');
                val.classList.remove('visited');
            });
        }

    }

    utils = {

        /**
         * Расчет коэффициента масштабирования для презентации
         * @returns {string}
         */
        getScale:function (){
            var size = this.getPageSize();
            return 'scale('+Math.min(
                size[0]/1024,size[1]/640
            )+')';
        },

        /**
         * Функция оызыврвщвет текущий размер документа
         * @returns {*[]} - 0-ширина, 1-высота
         */
        getPageSize:function (){
            pageHeight = this._getDocumentHeight();
            pageWidth = this._getDocumentWidth();

            return [pageWidth,pageHeight];//,windowWidth,windowHeight];
        },

        /**
         * Генерирует строку UID заданной длинны
         * @param len
         * @returns {string}
         */
        getUID: function (len){
            len = len || 5;
            var dic = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var out = '';
            for(var i=0;i<len;i++){
                out += dic.substr(0 || Math.random()*(dic.length-1),1);
            }
            return out;
        },

        _getDocumentHeight:function () {
            return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
        },

        _getDocumentWidth: function () {
            return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
        }



    }


    /**
     * Событие на загрузку страницы
     */
    window.addEventListener('DOMContentLoaded', function (){
        trace.info(utils.getPageSize());
        var list  = document.querySelectorAll('.presentation');
        if (list.length > 0){
            for (var i= 0,cnt = list.length;i<cnt;i++){
                list[i]['data-id'] = i;
                presentations.push(new jape(list[i]))
                presentations[i].init();

            }
        }
    });

    /**
     * Событие на нажатие кнопок клавиатуры
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
            case 39:
                var pr = presentations[curentPresentation];
                pr.next();
                break;
            case 37:
                var pr = presentations[curentPresentation];
                pr.previous();
                break;
        }
    })

    /**
     * Событие ресайза окна
     */
    window.addEventListener('resize',function(){
        var pr = presentations[curentPresentation];
        if (pr.state == 'full') {
            pr.applyScale(utils.getScale());
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
        var body = document.querySelector('body'),
            delta,
            pr = presentations[curentPresentation],
            locked = body.getAttribute('data-scroll') === 'locked';


        if (pr != undefined && !locked && pr.state == 'full') {
            body.setAttribute('data-scroll', 'locked');

            if (e.deltaY === undefined) {
                if (e.detail) {
                    delta = (e.wheelDeltaY / e.detail / 120 * e.detail > 0) ? 1 : -1;
                } else {
                    delta = e.wheelDeltaY / 10;
                }
            } else {
                delta = -e.deltaY;
            }


            if (delta > 0) {
                pr.next();
            } else if (delta < 0) {
                pr.previous();
            }
            setTimeout(function() {
                body.setAttribute('data-scroll', 'unlocked');
            }, Math.abs(delta) > 3 ? 200 : 800);
        }
    }

    /**
     * Обработка клика мышки клик по правой вперед по левой назад
     */
    window.addEventListener("click",function (e){
        e = e || window.event;
        var pr = presentations[curentPresentation],
            body = document.querySelector('body'),
            lock = body.getAttribute('data-click') === 'locked';

        if (pr.state == 'full' && !lock){
            size = utils.getPageSize();
            if (e.screenX > (size[0]/2)){
                //pr.next();
            } else {
                //pr.previous();
            }
        }
    });

})(window,document);
