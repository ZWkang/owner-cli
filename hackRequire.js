const Module = require('module');
const fs = require('fs')
const beforRequire = Module.prototype.require
//  // 劫持require 方法
const Reporter = require('./Reporter')
let alias

const PATH = process.cwd() + '/.ownerrc'

try {
    Reporter.info('hack require function !')
    const ownerrcData = fs.readFileSync(PATH).toString();
    alias = JSON.parse(ownerrcData).alias
    if (alias) {
        Module.prototype.require = function (path, ...args) {
            for(let i in alias) {
                if(i instanceof RegExp) {
                    if( i.test(path) ) {
                        path = path.replace(i, alias[i])
                        break
                    }
                } else {
                    if (path.indexOf(i) > -1) {
                        path = path.replace(i, alias[i])
                        break
                    }
                }
                
            }
            return beforRequire.call(this, path, ...args) // 这里需要call this一下以确定模块包位置
        }
    }
} catch(e){
    // Reporter.emit('reporter', e)
    Reporter.error(e)
} finally {
    Reporter.info('hack require done!!')
}


module.exports = {
    cancelHack: function () {
        Reporter.info('already cancel hack require')
        Module.prototype.require = beforRequire
    }
}




