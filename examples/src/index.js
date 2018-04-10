import IndexBar from '../../src/index.js'
new IndexBar({
    changeCallback(char){
        console.log('char',char)
    }
})