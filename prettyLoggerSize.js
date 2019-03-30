const chalk = require('chalk')
const request = require('request-promise')
function calcSize(number) {
    const arr = ['B','KB', 'MB', 'GB']

    let size = 0;
    while(number >= 1024) {
        number = number / 1024
        ++size
    }

    const result = `${number.toFixed(2)} ${arr[size]}`
    return result
}
function fixData (data) {
    const {
        name,
        version,
        size,
        gzip,
        description,
        dependencyCount
    } = data
    return {
        name,
        dependencyCount,
        version,
        size,
        gzip,
        description
    }
}

class PrettyLoggerSize {
    constructor(name) {
        this.name = name
        this.data = {}
        this.fix = {
            'gzip': calcSize,
            'size': calcSize
        }
    }
    detectData (data) {
        return fixData(data)
    }
    handleError(error) {
        console.log(chalk.red(error.message))
        console.log('\n')
        console.log(chalk.red(error.statck))
        process.exit(1)
    }
    async downloadJson (name) {
        try {
            const res = await request({
                url: `https://bundlephobia.com/api/size?package=${name}`
            })
            .then(v => JSON.parse(v))
            this.data = this.detectData(res)
        }catch(e) {
            this.handleError(e)
        }
    }
    async start() {
        await this.downloadJson(this.name)
        Object.keys(this.fix).forEach(v => {
            this.data[v] = this.fix[v](this.data[v])
        })
        return this.data
    }
}

module.exports = PrettyLoggerSize