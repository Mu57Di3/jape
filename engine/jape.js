/**
 * Ядро Jape
 */

(function (win,doc){
    var window = win || {};
    var document = doc || {};
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
            console.info('benderlog - ' + timeStamp + arguments[0]);
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
                    console.log(arguments[0]);
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
        this.curentSlide = 0;
    }

    jape.prototype = {
        /**
         * Инициализация презентации
         */
        init: function (){
            trace.info('Инициализация презентации');
            this.slides = $('section',this.elem);

            // На первый слайд вешаем клик который развернет презентацию на полный экран
            this.slides[0].addEventListener('click',function (e){
                var el = e.currentTarget || e.target;
                curentPresentation = el.parentNode['data-id']
                utils.addClass(el,'full');
                this.curentSlide = 0;
                this.state = 'full';
            });
        }
    }

    utils = {

        addClass:function(el,cl){
            el.className += ' '+cl;
        },

        removeClass:function(el,cl){
            el.className = el.className.replace(cl,'');
        }
    }

    window.addEventListener('DOMContentLoaded', function (){
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
                utils.removeClass(pr.slides[pr.curentSlide],'full');
            break;
        }
    })

})(window,document);
