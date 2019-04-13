const commandExists = require('command-exists');
const pipeSpawn = require('./pipeSpawn')
const pkg = require('./package.json')
// const chalk = require('chalk')
const path = require('path')
const {to } = require('./help')
const modules = require('module')
const exec = require('child_process').exec
const fs = require('fs')
const Reporter = require('./Reporter.js')
const spinner = require('./spinner')

// async function install(moduleName, filePath, opts) {
//     await pipeSpawn('npm', ['i', '-D', moduleName])
// }

const red = (...args) => {
    return console.error(chalk.red.apply(null, args))
}

const requireRegExp = /(?:^|\n)(?!\/).*?(?:require\(['"])(.*?)['"]\)/gi

function isPackage(name) {
    try{
        require(name);
    }catch(e){
        return false
    }
    return true
}

const wrap = new Set()

let cancelHack
class PackageInstall {
    constructor(opts){
        this.registry = opts.registry || 'https://registry.npm.taobao.org'
        this.saveDev = opts.saveDev || true
        this.normalFile = new Map()
        this.entry = opts.filename
        this.mapPath = []
        this.testmap = new Map()
        // this.option = opts.option
        this.cmd = opts.cmd
        if (opts.isHack) {
            cancelHack = require('./hackRequire').cancelHack
        }
    }
    add(modulename) {
        return wrap.add(modulename)
    }
    has(moduleName) {
        return wrap.has(moduleName)
    }
    async start() {
        this.dfsWalk(this.entry)
        await this.download()
        try {
            // console.log(`${this.option} ${require.resolve(this.entry)}`)
            const workerProcess = exec(`${this.cmd} ${require.resolve(this.entry)}`, {})
            workerProcess.stdout.on('data', function (data) {
                // console.log('stdout: ' + data);
                Reporter.info('stdout' + data)
            });
            workerProcess.stderr.on('data', function (data) {
            // console.log('stderror: ' + data);
                Reporter.emit('error', data)
            });
        } catch(e) {
            spinner.fail()
            return Reporter.emit('error', e)
        } finally {
            cancelHack()
        }
    }
    async download() {
        
        const IteratorMap = wrap.keys()
        for(let i of IteratorMap) {
            spinner.start(`start resolve package ${i}`)
            const args = this.generatorArgs(i)
            // console.log(i)
            const [data, error] = await to(pipeSpawn('npm', args, {
                env: process.env
            }))
            if(error) {
                spinner.fail(error.message)
                this.handleError(error)
                return 
            }
            spinner.succeed(`success get package ${i}`)
        }
    }
    resolveFile(filename) {
        const content = fs.readFileSync(filename).toString()
        const packagesName = resolvePackage(content)
        // console.log(packagesName)
        // console.log(packagesName)
        packagesName.filter(v => /^[\w\d\-]*?$/.test(v)).forEach(v => {
            // console.log(v,isPackage(v))
            if(!isPackage(v)) {
                Reporter.info(`find package ${v}`)
                wrap.add(v)
            }
        })
        packagesName.filter(v => /^(?![\w\d])/.test(v)).forEach(v => {
            
            if(this.testmap.has(v)){
                return
            }
            const paths = path.resolve(filename, '..', v) // 多重路径下的处理
            this.mapPath.push(paths)
            this.testmap.set(v)
        })
        return this
    }
    generatorArgs(beforeArgs) {
        let args = []
        // args.push('install')
        args.push('--registry', this.registry)
        // args.push(this.saveDev)
        args = args.concat(beforeArgs)
        return args
    }
    handleError(error) {
        if(error instanceof Error ) {
            return Reporter.error(`
                ${error.message}
                ${error.stack}
            `)
        }
    }
    dfsWalk (entryPoint, filenamePrefix) {
        this.mapPath.push(entryPoint)
        
        while(this.mapPath.length > 0 ) {
            const shift = this.mapPath.shift()
            // console.log(shift,require.resolve(shift))
            this.resolveFile(require.resolve(shift))
        }
    }
}

// 解析引用模块中的require模块
function resolvePackage (filestring) {
    const requireStatement = filestring.match(requireRegExp) || []
    // console.log(requireStatement)
    const packagesName = requireStatement.map(v => {
        return v.match(/(?:require\(['"])(.*?)['"]\)/)[1]
    })
    return packagesName
}

module.exports = PackageInstall