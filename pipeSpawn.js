const spawn = require('child_process').spawn
const commandExists = require('command-exists');
const report = require('./Reporter')

const noop = () => {}

const reporter = report

module.exports = function (cmd, pack, opts, cb) {
    
    // const opts = {packageManager: 'npm'}
    if(typeof opts === 'function') {
        cb = opts
        opts = {}
    } else {
        opts = opts || {}
    }
    cb = cb || noop

    // packages to install prefix

    let packages = [].concat(pack).filter(v => !!v)

    if(packages.length === 0 ){
        return process.nextTick(() => {
            cb(null)
        })
    }

    let npmCmd = opts.command || 'npm'

    if(npmCmd) {
        npmCmd = process.platform === 'win32'
            ? 'npm.cmd'
            : 'npm'
    }

    const isYarn = commandExists('yarn')
    const option =  isYarn ? 'install' : 'install'
    
    packages = [option].concat(packages)
    cmd = isYarn ? 'npm': 'npm'

    // console.log(cmd, packages, opts)
    const sp = spawn(
        cmd,
        packages,
        opts
    )
    sp.stdout.on('data', (data) => {
        // console.log(data.toString())
    })
    sp.stderr.on('data', (data) => {
        reporter.emit('success', data)
    })
    return new Promise((resolve, reject) => {
        sp.on('error', reject)
        sp.on('close', (code) => {
            // console.log(code)
            if(code != 0 ) { // 标准的退出信号量为0
                // 234为无权限
                return reject(new Error(code))
            }
            return resolve()
        })
        sp.on('exit', (e) => {
            // console.log(e)
        })
    })
}