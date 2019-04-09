const EventEmitter = require('events').EventEmitter
const dayjs = require('dayjs')
const chalk = require('chalk')

const log = console.log
const noop = () => {}

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
    }
    get date() {
        return dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
    error(error, ...message) {
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
        return this.onSuccess(...args)
    }
    info(...args) {
        log(chalk.magenta(`[${this.date}][info]: `), ...args)
    }
    debug(...args) {
        log(chalk.cyan(`[${this.date}][debug]: `), ...args)
    }
    warn(...args) {
        console.warn(chalk.yellow(`[${this.date}][warn]: `), ...args)
    }
}

const report = new Reporter()

module.exports = report