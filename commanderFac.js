const commander = require('commander')
const commandConfig = require('./command')
const Reporter = require('./Reporter')
class Commander {
    constructor(...args) {
        this.configList = commandConfig.options
        this.commander = commander
    }

    register(obj, key, value) {
        if(value instanceof Array) {
            return obj[key](value.join(''))
        }
        return obj[key](value)
    }
    init() {
        this.configList.map(v => {
            let tempCommand = this.commander
            Object.keys(v).forEach(k => {
                if(k === 'option') {
                    v[k].forEach(vk => {
                        tempCommand = this.register(tempCommand, 'option', vk)
                    })
                } else if(k === 'action'){
                    const [filePath, functionName] = v[k].split(/\s+/gi)
                    // Reporter.info(k, v[k],filePath, functionName,require(filePath)[functionName])
                    tempCommand = this.register(tempCommand, 'action', require(filePath)[functionName])
                } else {
                    tempCommand = this.register(tempCommand, k, v[k])
                }
                
            })

        })
        // commander.command('modules-compare [package...]').action(async (packages) => {
        //     console.log('xixi', packages)
        // })
        // var temp = commander;
        // [{key: 'command', value: 'modules-compare [package...]'}, {key: 'action', value: (packages) => {console.log(packages)}}].forEach((v) => {
        //     temp = temp[v['key']](v['value'])
        // })
        // console.log(commander.command === commander['command'])
        setImmediate(() => {
            commander.parse(process.argv);
        })
        
        // console.log(commander)
    }
}

module.exports = Commander