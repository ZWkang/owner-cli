

module.exports = {
  options: [
    {
      description: "npm install package use npm package manager",
      command: "install <package>",
      alias: "n",
      options: ["-u, --uninstall", "uninstall package"],
      action: 'filepath function'
    },
    {
      description: "download leetcode problem in workshop",
      command: "downloadleetcode <leetcodeName>",
      alias: "dl",
      options: [["-t, --type", "js,md,both"], ["-rt, --resolve", "default type is js file type"]],
      action: "filepath function"
    },
    {
      description: "modules compare package size",
      alias: "mc",
      command: "modules-compare [package...]",
      options: []
    }
  ]
}