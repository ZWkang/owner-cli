#!/usr/bin/env node

// const commander = require('commander')
const exec = require('child_process').exec
const prettyLoggerSize = require('./prettyLoggerSize')
const chalk = require('chalk')
const fs = require('fs')
const installPackage = require('./installPackage')

const installPackageString = (name) => `npm install ${name} --save-dev`
const uninstallPackageString = (name) => `npm uninstall ${name}`

const download = require('./resolveleetcode')
const handleCreateAgamennonFile = require('./handleCreateAgamennonFile')

const handleNormalCallback = (error, data) => {
    if(error){
        console.log(data)
        return
    }
    console.log(data)
}
module.exports = {
    installPackage: (package, args) => {
        if(args.uninstall) {
            exec(uninstallPackageString(package), handleNormalCallback)
            return
        }
        exec(installPackageString(package), handleNormalCallback)
    },

    downloadLeetcode: async (leetcodeName, args) => {
        if(!leetcodeName) {
            console.log(chalk.red(' you must enter leetcode name \n downleetcode <leetcodeName>\n d <leetcodeName>'))
            return
        }
        try {
            const { translatedContent, translatedTitle, questionFrontendId, titleSlug } = await new download({
                name: leetcodeName
            }).init()
            const mdFileAndPath = process.cwd() + `/${questionFrontendId}.${translatedTitle}.md`
            const jsFileAndPath =  process.cwd() + `/${questionFrontendId}.${titleSlug}.js`
            fs.writeFileSync(mdFileAndPath, translatedContent)
            fs.writeFileSync(jsFileAndPath, '')
            console.log(chalk.green(`success create file: 
                ${mdFileAndPath}
                ${jsFileAndPath}
            `))
        }catch (e) {
            console.log(chalk.red(`创建失败 \n${e.message}`))
        }
        return 
    },

    moduleCompare: async (package, ...args)=>{
        console.log(package)
        if(!package) {
            console.log(chalk.red('no package name'))
        }
        try {
            const map = package.map(v => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const res = await new prettyLoggerSize(v).start()
                        return resolve(res)
                    }catch(e) {
                        reject(e)
                    }
                })
            })
            const mapdata = await Promise.all(map)
            console.table(mapdata)
        }catch(e) {
            console.log(chalk.red(`fail compare \n${e.message}`))
        }
    },

    rundev: async (cmd, filename, args) => {
        const { isHackRequire } = args
        // console.log(cmd, filename)
        // if(isHackRequire) {
        //     require('./hackRequire')
        // }
        await new installPackage({
            filename: './'+filename,
            cmd: cmd,
            isHack: isHackRequire
        }).start()
    },

    acreate: (name) => {
        handleCreateAgamennonFile(name)
    }
}