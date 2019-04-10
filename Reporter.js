const EventEmitter = require('events').EventEmitter
const dayjs = require('dayjs')
const chalk = require('chalk')

const log = console.log
const noop = () => {}
const isDef = v => v === void 666

class Reporter extends EventEmitter {
    constructor(handleError){
        super()
        this.handleError = handleError || noop
        this.on('reporter', this.error)
        this.on('error', this.error)
        this.on('success', this.success)
        this.on('warn', this.warn)
        this.on('info', this.info)
        this.on('debug', this.debug)
        this.logLevel = 3
    }
    get date() {
        return dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    setOptions (options) {
        options = options || { logLevel: 3 }
        this.logLevel = isDef(options.logLevel) ? 3 : options.logLevel
        console.log(this.logLevel, options)
    }
    error(error, ...message) {
        if(this.logLevel < 1) return
        if(error instanceof Error) {
            const logstring = `
ERROR_MESSAGE: ${error.message}

ERROR_STACK:
    ${error.stack}
            `
            log(chalk.red(`[${this.date}][error]: `), logstring)
            const result = this.handleError(error, logstring)
            return result
        }
        log(chalk.red(`[${this.date}][error]: `), error, ...message)
        return this.handleError(error)
    }
    onSuccess(...args) {
        log(chalk.green(`[${this.date}][success]: `), ...args)
    }
    success(...args) {
        if(this.logLevel < 1) return
        return this.onSuccess(...args)
    }
    info(...args) {
        if(this.logLevel < 3) return
        log(chalk.magenta(`[${this.date}][info]: `), ...args)
    }
    debug(...args) {
        if(this.logLevel < 3) return
        log(chalk.cyan(`[${this.date}][debug]: `), ...args)
    }
    warn(...args) {
        if(this.logLevel < 2) return
        console.warn(chalk.yellow(`[${this.date}][warn]: `), ...args)
    }
    clear() {
        if (this.logLevel > 3) {
          return;
        }
        // window只是清空当前的终端窗口
        console.clear()
      }
}

const report = new Reporter()

module.exports = report