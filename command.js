

module.exports = {
  options: [
    {
      command: "install <package>",
      description: "npm install package use npm package manager",
      alias: "n",
      option: ["-u, --uninstall", "uninstall package"],
      action: './action.js installPackage'
    },
    {
      command: "downloadleetcode <leetcodeName>",
      description: "download leetcode problem in workshop",
      alias: "dl",
      option: [["-t, --type", "js,md,both"], ["-rt, --resolve", "default type is js file type"]],
      action: "./action.js downloadLeetcode"
    },
    {
      command: 'modules-compare [package...]',
      description: "modules compare package size",
      alias: "mc",
      
      option: [],
      action: "./action.js moduleCompare"
    },
    {
      command: "rundev [cmd] [filename]",
      description: "just run your code in command",
      alias: "rd", 
      action: "./action.js rundev",
      option: ["-r, --isHackRequire", "is open hack config"]
    }
  ]
}