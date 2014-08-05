/**
 * Ядро Jape
 */

(function (win,doc){
    var window = win || {};
    var document = doc || {};
    var debug = true;
    var presentations = [];

    function trace() {
        if (!debug){ return false };
        var now = new Date();
        var timeStamp = '[' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds() + '] ';
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


    window.jape = function (){
        this.slides = {}
    }

    jape.prototype = {
        init: function (){

        },

        run:function (){

        }
    }

    utils = {
        findPresentations: function (){
            trace(document.querySelectorAll('presentation'));
        }
    }

    window.addEventListener('DOMContentLoaded', function (){
        utils.findPresentations();
    });
})(window,document);
