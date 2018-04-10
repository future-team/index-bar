'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

require('../css/index.less');

function applyStyle($dom, style) {
    Object.keys(style).forEach(function (props) {
        $dom.style[props] = style[props];
    });
}
function getChat(chars, percent) {
    var count = chars.length;
    var idx = Math.floor(percent * count);
    if (idx == count) {
        idx = idx - 1;
    }
    return chars[idx];
}

var IndexBar = (function () {
    function IndexBar(opts) {
        _classCallCheck(this, IndexBar);

        var defaultOpts = {
            chars: ['热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            fontScale: 0.7,
            top: 60,
            bottom: 60,
            changeCallback: function changeCallback() {}
        };
        this.options = _extends({}, defaultOpts, opts);
        this.init();
    }

    IndexBar.prototype.init = function init() {
        var $container = document.createElement('div');
        this.$container = $container;
        var options = this.options;
        var top = options.top;
        var bottom = options.bottom;
        var chars = options.chars;

        var containerStyle = {
            position: 'fixed',
            top: top + 'px',
            bottom: bottom + 'px',
            right: '0'
        };
        applyStyle($container, containerStyle);

        $container.innerHTML = this.renderList(chars);
        document.body.appendChild($container);
        this.initEvents(options);
    };

    IndexBar.prototype.initEvents = function initEvents(_ref) {
        var chars = _ref.chars;
        var changeCallback = _ref.changeCallback;
        var $container = this.$container;

        var ctnRect = $container.getBoundingClientRect();
        var height = ctnRect.height;
        var top = ctnRect.top;

        var touching = false;
        var lastChar = undefined;
        function beforeMove(clientY) {
            touching = true;
            moving(clientY);
        }
        function moving(clientY) {
            var offsetY = clientY - top;
            if (offsetY < 0) {
                offsetY = 0;
            } else if (offsetY > height) {
                offsetY = height;
            }
            var percent = offsetY / height;

            var char = getChat(chars, percent);
            if (char && lastChar !== char) {
                lastChar = char;
                changeCallback(char);
            }
        }
        function afterMove() {
            touching = false;
        }
        var evtNameMap = {
            beforeMove: 'touchstart',
            moving: 'touchmove',
            afterMove: 'touchend'
        };
        var onMobile = ('ontouchstart' in document);
        if (!onMobile) {
            evtNameMap = {
                beforeMove: 'mousedown',
                moving: 'mousemove',
                afterMove: 'mouseup'
            };
        }
        $container.addEventListener(evtNameMap.beforeMove, function (e) {
            if (!touching) {
                e.preventDefault();
                var clientY = onMobile ? e.touches[0].clientY : e.clientY;
                beforeMove(clientY);
            }
        }, false);
        document.addEventListener(evtNameMap.moving, function (e) {
            if (touching) {
                e.preventDefault();
                var clientY = onMobile ? e.touches[0].clientY : e.clientY;
                moving(clientY);
            }
        }, false);
        document.addEventListener(evtNameMap.afterMove, function (e) {
            if (touching) {
                e.preventDefault();
                afterMove();
            }
        }, false);
    };

    IndexBar.prototype.renderList = function renderList(chars) {
        var charCount = chars.length;
        var options = this.options;
        var $container = this.$container;
        var top = options.top;
        var bottom = options.bottom;
        var fontScale = options.fontScale;

        var containerHeight = window.innerHeight - top - bottom;
        var lineHeight = Math.floor(containerHeight / charCount);
        var fontSize = Math.floor(lineHeight * fontScale);
        var fontStyle = 'font-size:' + fontSize + 'px;line-height:' + lineHeight + 'px';
        //修正bottom值(由于lineheight为整数)
        bottom = window.innerHeight - top - lineHeight * charCount;
        $container.style.bottom = bottom + 'px';
        return '<div style="text-align:center' + (fontScale ? ';' + fontStyle : '') + '">\n            ' + chars.map(function (char) {
            return '<div>' + char + '</div>';
        }).join('') + '\n            </div>';
    };

    return IndexBar;
})();

exports['default'] = IndexBar;
module.exports = exports['default'];