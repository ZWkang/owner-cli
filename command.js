module.exports = {
  options: [
    {
      command: "install <package>",
      description: "npm install package use npm package manager",
      alias: "n",
      option: ["-u, --uninstall", "uninstall package"],
      action: "./action.js installPackage"
    },
    {
      command: "downloadleetcode <leetcodeName>",
      description: "download leetcode problem in workshop",
      alias: "dl",
      option: [
        ["-t, --type <filetype>", "js,md,both"],
        ["-s --savefile <savefilename> ", "savefile name"],
        ["-n --notetype <notefiletype>", "note file save type"],
        ["-c, --codeSnippet ", "display all the code snippets type"]
      ],
      action: "./action.js downloadLeetcode"
    },
    {
      command: "modules-compare [package...]",
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
    },
    {
      command: "acreate [filename]",
      description: "just use in agamennon ok?",
      alias: "ac",
      action: "./action.js acreate"
    }
  ]
};
