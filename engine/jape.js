/**
 * Ядро Jape
 */

(function (win,doc){
    var window = win || {};
    var document = doc || {};
    var presentations = [];

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

        info: function (){
            if (!this.debug) { return false }
            var timeStamp = this._getTimeStamp();
            console.info('benderlog - ' + timeStamp + arguments[0]);
        },

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
                    console.dir(arguments[0]);
                } else {
                    console.log('benderlog - ' + timeStamp + arguments[0]);
                    console.trace();
                }


            }
        }
    }


    window.jape = function (el){
        this.elem = el;
        this.slides = {}
    }

    jape.prototype = {
        init: function (){
            trace.info('Инициализация презентации');
            var list = $('section',this.elem);
            trace.log(list);
        }
    }

    utils = {
        findPresentations: function (){
            var list  = document.querySelectorAll('presentation');
            if (list.length > 0){
                for (var i= 0,cnt = list.length;i<cnt;i++){
                    presentations.push(new jape(list[i]))
                    presentations[i].init();
                }
            }

        }
    }

    window.addEventListener('DOMContentLoaded', function (){
        utils.findPresentations();
    });
})(window,document);
