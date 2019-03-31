const commandExists = require('command-exists');
const pipeSpawn = require('./pipeSpawn')
const pkg = require('./package.json')
// const chalk = require('chalk')
const path = require('path')
const {to } = require('./help')
const modules = require('module')
const fs = require('fs')

// async function install(moduleName, filePath, opts) {
//     await pipeSpawn('npm', ['i', '-D', moduleName])
// }

const red = (...args) => {
    return console.error(chalk.red.apply(null, args))
}

const requireRegExp = /(?:require\(['"])(.*?)['"]\)/gi

function isPackage(name) {
    try{
        require(name);
        console.log(name)
    }catch(e){
        return false
    }
    return true
}

const wrap = new Set()
class PackageInstall {
    constructor(opts){
        this.registry = opts.registry || 'https://registry.npm.taobao.org'
        this.saveDev = opts.saveDev || true
        this.normalFile = new Map()
        this.entry = opts.filename
        this.mapPath = []
        this.testmap = new Map()
    }
    add(modulename) {
        return wrap.add(modulename)
    }
    has(moduleName) {
        return wrap.has(moduleName)
    }
    async start() {
        this.resolveFile(this.entry)
        await this.download()
    }
    async download() {
        const IteratorMap = wrap.keys()
        for(let i of IteratorMap) {
            const args = this.generatorArgs(i)
            console.log(args)
            const [data, error] = await to(pipeSpawn('npm', args, {
                env: process.env
            }))
            console.log(data)
            if(error) {
                this.handleError(error)
                return 
            }
        }
    }
    resolveFile(filename) {
        const content = fs.readFileSync(filename).toString()
        // console.log(content)
        const packagesName = resolvePackage(content)
        packagesName.filter(v => /^[\w\d]*?$/.test(v)).forEach(v => {
            console.log(v,isPackage(v))
            if(!isPackage(v)) {
                wrap.add(v)
            }
        })
        packagesName.filter(v => /^(?![\w\d])/.test(v)).forEach(v => {
            
            if(this.testmap.has(v)){
                return
            }
            this.mapPath.push(v)
            this.testmap.set(v)
        })
        return this
    }
    generatorArgs(beforeArgs) {
        let args = []
        args.push('install')
        args.push('--registry', this.registry)
        // args.push(this.saveDev)
        args = args.concat(beforeArgs)
        return args
    }
    handleError(error) {
        if(error instanceof Error ) {
            return red(`
                ${error.message}
                ${error.stack}
            `)
        }
    }
    dfsWalk (entryPoint, filenamePrefix) {
        this.mapPath.push(entryPoint)
        while(this.mapPath.length > 0 ) {
            const shift = this.mapPath.shift()
            this.resolveFile(require.resolve(shift))
        }
    }
}


function resolvePackage (filestring) {
    // console.log(filestring)

    const requireStatement = filestring.match(requireRegExp) || []
    const packagesName = requireStatement.map(v => {
        return v.match(/(?:require\(['"])(.*?)['"]\)/)[1]
    })
    return packagesName
}

module.exports = PackageInstall