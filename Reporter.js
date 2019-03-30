const EventEmitter = require('events').EventEmitter
const dayjs = require('dayjs')
const chalk = require('chalk')

const pipeSpawn = require('./pipeSpawn')

const noop = () => {}
class Reporter extends EventEmitter {
    constructor(handleError){
        super()
        this.handleError = handleError || noop
        this.on('reporter', this.onReporter);
    }
    onReporter(error) {
        if(error instanceof Error) {
            const nowDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
            const logstring = `
ERROR_TIME: ${nowDate}
ERROR_MESSAGE: ${error.message}

ERROR_STACK:
    ${error.stack}
            `
            console.log(chalk.red(logstring))
            const result = this.handleError(error, logstring)
            return result
        }
        // if(!(error instanceof Error)) {
        //     console.log(chalk.red(`ERROR_MESSAGE: ${error}`))
        // }
    }
    onSuccess(message) {
        console.log(chalk.green(message))
    }
}

// require('child_process').spawn('ls', ['-lh', '/var'])

pipeSpawn('npm', 'underscore')
module.exports = Reporter