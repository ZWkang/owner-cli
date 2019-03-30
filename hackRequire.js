// const { alias } = require()
const Module = require('module');
const fs = require('fs')
const beforRequire = Module.prototype.require
//  // 劫持require 方法
const Reporter = require('./Reporter')
const report = new Reporter()
let alias

try {
    const ownerrcData = fs.readFileSync(process.cwd() + '/.ownerrc').toString();
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
    report.emit('reporter', e)
} finally {
    
}




