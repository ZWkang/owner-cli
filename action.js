#!/usr/bin/env node

// const commander = require('commander')
const exec = require("child_process").exec;
const prettyLoggerSize = require("./prettyLoggerSize");
const chalk = require("chalk");
const fs = require("fs");
const installPackage = require("./installPackage");

const installPackageString = name => `npm install ${name} --save-dev`;
const uninstallPackageString = name => `npm uninstall ${name}`;
const Reporter = require("./Reporter");
const codeSnippetsMaps = require("./codesnippets.json");
const download = require("./resolveleetcode");
const handleCreateAgamennonFile = require("./handleCreateAgamennonFile");
const markLeetcodeDownload = require("./leetcodedownloadCache");

/**
 * 展示codeSnippets json内容
 */
function doWithDisplayCodeSnippetsTypes() {
  /**
   * 获得键
   */
  const MapsKeys = Object.keys(codeSnippetsMaps);
  // 想将其进行字符串大小依次输出 （比较好看）
  const sortedMapsKeys = MapsKeys.sort((a, b) => a.length - b.length);
  // 计算最长字符串，用于后面填充
  const LongestString = sortedMapsKeys[sortedMapsKeys.length - 1];
  // 拿到最长字符串长度
  const LongestLength = LongestString.length;
  // 获得输出字符串
  const displayContent = Array.from(sortedMapsKeys).reduce((prev, next) => {
    const nextLength = next.length;
    // 用最长依次遍历时候计算repeat空格即可
    const fixedSpace = " ".repeat(LongestLength - nextLength + 1);
    const [Lang, filetype] = codeSnippetsMaps[next];
    return `${prev}\n${next}${fixedSpace}: Lang is ${Lang}, demo file type is ${filetype}`;
  }, "");
  // 输出一下
  Reporter.info(displayContent);
}

const handleNormalCallback = (error, data) => {
  if (error) {
    console.log(data);
    return;
  }
  console.log(data);
};
module.exports = {
  installPackage: (package, args) => {
    if (args.uninstall) {
      exec(uninstallPackageString(package), handleNormalCallback);
      return;
    }
    exec(installPackageString(package), handleNormalCallback);
  },

  downloadLeetcode: async (leetcodeName, args) => {
    const { savefile, type = "js", notetype = "md", codeSnippet } = args;
    const [defaultLang, actualDemoFileType] = codeSnippetsMaps[type] || [
      "JavaScript",
      "js"
    ];
    if (!leetcodeName) {
      console.log(
        chalk.red(
          " you must enter leetcode name \n downleetcode <leetcodeName>\n d <leetcodeName>"
        )
      );
      return;
    }
    if (codeSnippet) {
      doWithDisplayCodeSnippetsTypes();
      return;
    }
    try {
      const {
        translatedContent,
        translatedTitle,
        questionFrontendId,
        titleSlug,
        codeSnippets,
        questionId,
        difficulty
      } = await new download({
        name: leetcodeName
      }).init();

      const Snippets = codeSnippets.filter(item => item.lang === defaultLang);
      const { code: jsFileContent } = Snippets[0];
      const mdFileAndPath =
        process.cwd() + `/${questionFrontendId}.${translatedTitle}.${notetype}`;
      const jsFileAndPath =
        process.cwd() +
        `/${questionFrontendId}.${titleSlug}.${actualDemoFileType}`;

      const mdFileAndPathExist = fs.existsSync(mdFileAndPath);
      const jsFileAndPathExist = fs.existsSync(jsFileAndPath);
      // 避免覆盖掉原有文件
      if (mdFileAndPathExist || jsFileAndPathExist) {
        // throw new Error(`${mdFileAndPath}\nor\n${jsFileAndPath}\nexist`);
      }
      // 同步写入文件
      fs.writeFileSync(mdFileAndPath, translatedContent);
      fs.writeFileSync(jsFileAndPath, jsFileContent);
      if (savefile) {
        markLeetcodeDownload({
          filename: savefile || "markleetcode.md",
          rootPath: process.cwd(),
          translatedTitle,
          questionId,
          titleSlug,
          difficulty
        });
      }

      Reporter.success(`success create file: 
                ${mdFileAndPath}
                ${jsFileAndPath}
            `);
    } catch (e) {
      Reporter.error(chalk.red(`创建失败 \n${e.message}`));
    }
    return;
  },

  moduleCompare: async (package, ...args) => {
    if (!package) {
      console.log(chalk.red("no package name"));
    }
    try {
      const map = package.map(v => {
        return new Promise(async (resolve, reject) => {
          try {
            const res = await new prettyLoggerSize(v).start();
            return resolve(res);
          } catch (e) {
            reject(e);
          }
        });
      });
      const mapdata = await Promise.all(map);
      console.table(mapdata);
    } catch (e) {
      console.log(chalk.red(`fail compare \n${e.message}`));
    }
  },

  rundev: async (cmd, filename, args) => {
    const { isHackRequire } = args;
    // console.log(cmd, filename)
    // if(isHackRequire) {
    //     require('./hackRequire')
    // }
    await new installPackage({
      filename: "./" + filename,
      cmd: cmd,
      isHack: isHackRequire
    }).start();
  },

  acreate: name => {
    handleCreateAgamennonFile(name);
  }
};
