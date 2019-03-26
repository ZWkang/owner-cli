#!/usr/bin/env node

const commander = require('commander')
const exec = require('child_process').exec
const chalk = require('chalk')
const fs = require('fs')
const helpString = `
|-----------------------------|
|                             |
|   -h --help show help list  |
|                             |
|-----------------------------|
        @ZWkang author
`

const installPackageString = (name) => `npm install ${name} --save-dev`
const uninstallPackageString = (name) => `npm uninstall ${name}`

const download = require('./resolveleetcode')
commander.version('0.1.0')
  .option('-h, --helpcommander', 'show help list')
  .action(() => {
    console.log(helpString)
  })

const handleNormalCallback = (error, data) => {
    if(error){
        console.log(data)
        return
    }
    console.log(data)
}

commander.command('npmpackage <package>')
    .description('npmpackage npm package')
    .alias('n')
    .option('-u, --uninstall', "uninstall packages")
    .action((package, args) => {
        if(args.uninstall) {
            exec(uninstallPackageString(package), handleNormalCallback)
            return
        }
        exec(installPackageString(package), handleNormalCallback)
    })

commander.command('downleetcode <leetcodeName>')
    .description('download your problem')
    .alias('n')
    .action(async (leetcodeName, args) => {
        if(!leetcodeName) {
            console.log(chalk.red(' you must enter leetcode name \n downleetcode <leetcodeName>\n d <leetcodeName>'))
            return
        }
        const {translatedContent, translatedTitle, questionFrontendId} = await new download({
            name: leetcodeName
        }).init()
        try {
            const filenameAndPath =__dirname + `/${questionFrontendId}_${translatedTitle}.md`
            fs.writeFileSync(filenameAndPath, translatedContent)
            console.log(chalk.green(`success create file: $`))
        }catch (e) {
            console.log(chalk.red(`创建失败 \n${e.message}`))
        }
        return 
    })
commander.parse(process.argv);
