import '../css/index.less'
function applyStyle($dom, style) {
    Object.keys(style).forEach((props) => {
        $dom.style[props] = style[props]
    })
}
function getChat(chars,percent) {
    let count=chars.length
    let idx=Math.floor(percent*count)
    if(idx==count){
        idx=idx-1
    }
    return chars[idx]
}
export default class IndexBar {
    constructor(opts) {
        let defaultOpts = {
            containerClassName:'idx-bar-container',
            chars: ['热门', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
            fontScale: 0.7,
            top: 60,
            bottom: 60,
            changeCallback(){}
        }
        this.options = {
            ...defaultOpts,
            ...opts
        }
        this.init()
    }
    init() {
        let $container = document.createElement('div')
        this.$container = $container
        let { options } = this
        let { top, bottom, chars, containerClassName} = options
        $container.className=containerClassName
        let containerStyle = {
            position: 'fixed',
            top: `${top}px`,
            bottom: `${bottom}px`,
            right: '0'
        }
        applyStyle($container, containerStyle)

        $container.innerHTML = this.renderList(chars)
        document.body.appendChild($container)
        this.initEvents(options)
    }
    initEvents({chars,changeCallback}) {
        let { $container } = this
        let ctnRect = $container.getBoundingClientRect()
        let { height,top} = ctnRect
        let touching = false
        let lastChar
        function beforeMove(clientY) {
            touching=true
            moving(clientY)
        }
        function moving(clientY) {
            let offsetY = clientY - top
            if (offsetY < 0) {
                offsetY = 0
            } else if (offsetY > height) {
                offsetY = height
            }
            let percent=offsetY/height

            let char=getChat(chars,percent)
            if (char && lastChar !== char) {
                lastChar = char
                changeCallback(char)
            }
        }
        function afterMove() {
            touching=false
        }
        let evtNameMap={
            beforeMove:'touchstart',
            moving:'touchmove',
            afterMove:'touchend'
        }
        let onMobile = 'ontouchstart' in document
        if(!onMobile){
            evtNameMap = {
                beforeMove: 'mousedown',
                moving: 'mousemove',
                afterMove: 'mouseup'
            }
        }
        $container.addEventListener(evtNameMap.beforeMove, e => {
            if (!touching) {
                e.preventDefault()
                let clientY=(onMobile?e.touches[0].clientY:e.clientY)
                beforeMove(clientY)
            }
        }, false)
        document.addEventListener(evtNameMap.moving, e => {
            if (touching) {
                e.preventDefault()
                let clientY=(onMobile?e.touches[0].clientY:e.clientY)
                moving(clientY)
            }
        }, false)
        document.addEventListener(evtNameMap.afterMove, e => {
            if (touching) {
                e.preventDefault()
                afterMove()
            }
        }, false)
    }
    renderList(chars) {
        let charCount = chars.length
        let { options, $container } = this
        let { top, bottom } = options
        let { fontScale } = options
        var containerHeight = window.innerHeight - top - bottom
        var lineHeight = Math.floor(containerHeight / charCount)
        var fontSize = Math.floor(lineHeight * fontScale)
        var fontStyle = `font-size:${fontSize}px;line-height:${lineHeight}px`
        //修正bottom值(由于lineheight为整数)
        bottom = window.innerHeight - top - lineHeight * charCount
        $container.style.bottom = `${bottom}px`
        return `<div style="text-align:center${(fontScale ? ';' + fontStyle : '')}">
            ${chars.map(char => `<div>${char}</div>`).join('')}
            </div>`
    }
}