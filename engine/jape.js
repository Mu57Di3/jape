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
        this.slides = [];
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
            that = this;
            trace.info('Инициализация презентации');
            this.slides = $('section',this.elem);

            forEach(this.slides,function (id,val){
                var t = $('.next',val);
                if (t != null && t.length>0){
                    var uid = utils.getUID();
                    val['id']= uid;
                    val['data-next-parent'] = '1';
                    this.showList.push(val);
                    forEach(t,function (id,item){
                        item['data-parent'] = uid;
                        this.push(item);
                    },this.showList);
                } else {
                    this.showList.push(val);
                }
            },this);
            forEach(this.showList,function(id,item){
                item['data-slideid'] = id;
            });
            trace.info(this.showList);

            // На первый слайд вешаем клик который развернет презентацию на полный экран
            this.slides[0].addEventListener('click',function (e){
                that.start.call(that);

            });
        },

        showSlide: function(id,direction){
            direction = direction || 'forward';
            var showList = this.showList;

            if (id < showList.length && id>=0){
                var slide = showList[id];

                if (direction == 'back' && slide['data-parent'] !=undefined ){
                    slide = document.querySelector('#'+slide['data-parent']);
                    id = slide['data-slideid'];
                }
                trace.info(slide);
                slide.classList.add('active');
                slide.classList.remove('visited');

                this.curentSlide = id;

            } else {
                this.curentSlide = this.showList.length-1;
            }
            trace.info(this.curentSlide);
        },

        hideSlide: function(id,direction){
            direction = direction || 'forward';
            var showList = this.showList,
                slide = showList[id];
            if (slide != undefined) {
                if (slide['data-parent'] == undefined && slide['data-next-parent'] == undefined){
                    slide.classList.remove('active');
                    slide.classList.add('visited');
                    var pID = this._getPrevious(id,direction);
                    trace.info('pid1 '+pID);
                    if (showList[pID]!= undefined && showList[pID]['data-parent']!=undefined){
                        var complite = false,
                            i = pID;
                        while(!complite){
                            showList[i].classList.remove('active');
                            if (showList[i]['data-next-parent']){
                                showList[i].classList.add('visited');
                                complite = true;
                            } else {
                                i = this._getPrevious(i,direction);
                            }
                        }
                    }
                } else {
                    if (direction == 'back'){
                        slide.classList.remove('active');
                        slide.classList.add('visited');
                        var t = $('.next',slide);
                        if (t){
                            forEach(t,function (id,item){
                                item.classList.remove('active');
                                item.classList.add('visited');
                            })
                        }
                    }
                }
            } else {
                var pID = this._getPrevious(id,direction);
                trace.info('pid2 '+pID);
                if (showList[pID]!= undefined && showList[pID]['data-parent']!=undefined){
                    var complite = false,
                        i = pID;
                    while(!complite){
                        showList[i].classList.remove('active');
                        if (showList[i]['data-next-parent']){
                            showList[i].classList.add('visited');
                            complite = true;
                        } else {
                            i = this._getPrevious(i,direction);
                        }
                    }
                }
            }
            trace.info('hide '+this.curentSlide);
        },

        next:function (){
            if (this.state == 'full') {
                this.hideSlide(this.curentSlide,'forward');
                this.showSlide(this.curentSlide + 1,'forward');
            }
        },

        previous: function (){
            if (this.state == 'full') {
                this.hideSlide(this.curentSlide,'back');
                this.showSlide(this.curentSlide - 1,'back');
            }
        },

        start: function(){
            curentPresentation = this.elem['data-id'];
            this.applyScale(utils.getScale());
            this.elem.classList.add('full');
            this.elem.classList.remove('list');
            trace.info(this.state);
            if (this.state == 'normal'){

                this.showSlide(0);
                this.state = 'full';
            }
            document.body.classList.add('offScroll');

            setTimeout(function() {
                trace.info('unlock');
                var body = document.querySelector('body');
                body.setAttribute('data-click', 'unlocked');
            }, 200);

        },

        stop:function (){
            this.elem.classList.remove('full');
            this.elem.classList.add('list');
            this.applyScale('none');
            this.state = 'normal';
            document.body.classList.remove('offScroll');
            var body = document.querySelector('body');
            body.setAttribute('data-click', 'locked');
            forEach(this.showList,function(id,item){
                item.classList.remove('visited');
            });
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

        if ( !locked && pr.state == 'full') {
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
                pr.next();
            } else {
                pr.previous();
            }
        }
    });

})(window,document);
