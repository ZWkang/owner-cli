#!/usr/bin/env node

const pkg = require(__dirname + '/package.json')
// const commander = require('commander')
// const exec = require('child_process').exec
// const prettyLoggerSize = require('./prettyLoggerSize')
// const chalk = require('chalk')
// const fs = require('fs')
// const installPackage = require('./installPackage')
// // const helpString = `
// // |-------------------------------|
// // |                               |
// // |   -h --help show help list    |
// // |   npmpackage <package>        |
// // |   downleetcode <leetcodeName> |
// // |                               |
// // |-------------------------------|
// //         @ZWkang author
// // `

// const installPackageString = (name) => `npm install ${name} --save-dev`
// const uninstallPackageString = (name) => `npm uninstall ${name}`

// const download = require('./resolveleetcode')
// // commander.version('0.1.0')
// // //   .option('-h, --helpcommander', 'show help list')
// //   .action(() => {
// //     console.log(helpString)
// //   })

// // console.log(commander)

// const handleNormalCallback = (error, data) => {
//     if(error){
//         console.log(data)
//         return
//     }
//     console.log(data)
// }

// commander.command('npmpackage <package>')
//     .description('npmpackage npm package')
//     .alias('n')
//     .option('-u, --uninstall', "uninstall packages")
//     .action((package, args) => {
//         if(args.uninstall) {
//             exec(uninstallPackageString(package), handleNormalCallback)
//             return
//         }
//         exec(installPackageString(package), handleNormalCallback)
//     })

// commander.command('downleetcode <leetcodeName>')
//     .description('download your problem')
//     .alias('dl')
//     .action(async (leetcodeName, args) => {
//         if(!leetcodeName) {
//             console.log(chalk.red(' you must enter leetcode name \n downleetcode <leetcodeName>\n d <leetcodeName>'))
//             return
//         }
//         try {
//             const { translatedContent, translatedTitle, questionFrontendId, titleSlug } = await new download({
//                 name: leetcodeName
//             }).init()
//             const mdFileAndPath = process.cwd() + `/${questionFrontendId}.${translatedTitle}.md`
//             const jsFileAndPath =  process.cwd() + `/${questionFrontendId}.${titleSlug}.js`
//             fs.writeFileSync(mdFileAndPath, translatedContent)
//             fs.writeFileSync(jsFileAndPath, '')
//             console.log(chalk.green(`success create file: 
//                 ${mdFileAndPath}
//                 ${jsFileAndPath}
//             `))
//         }catch (e) {
//             console.log(chalk.red(`创建失败 \n${e.message}`))
//         }
//         return 
//     })

// commander.command('modules-compare [package...]')
//     .alias('mc')
//     .action(async (package, ...args)=>{
//         if(!package) {
//             console.log(chalk.red('no package name'))
//         }
//         try {
//             const map = package.map(v => {
//                 return new Promise(async (resolve, reject) => {
//                     try {
//                         const res = await new prettyLoggerSize(v).start()
//                         return resolve(res)
//                     }catch(e) {
//                         reject(e)
//                     }
//                 })
//             })
//             const mapdata = await Promise.all(map)
//             console.table(mapdata)
//         }catch(e) {
//             console.log(chalk.red(`fail compare \n${e.message}`))
//         }
//     })

// commander.command('rundev [option] [filename]')
//     .description('just run your code in command')
//     .action(async (option, filename, ...args) => {
//         // console.log(option, filename)
//         // try {

//         // }
//         await new installPackage({
//             filename: './'+filename,
//             option
//         }).start()
//     })
// commander.parse(process.argv);
const Commander = require('./commanderFac')
const ownerCommander = new Commander()
ownerCommander.register(ownerCommander.commander, 'version', pkg.version || '0.0.1')

ownerCommander.init()
// console.log(new Commander().init())

