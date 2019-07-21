/**
 * 用来记录当前的leetcode 每天 每日下载的题目。
 * 方便用来汇总
 */

const fs = require("fs");
const path = require("path");
const dayjs = require("dayjs");
const Reporter = require("./Reporter");

const leetcodedownloadCache = function({
  filename,
  rootPath,
  translatedTitle,
  questionId,
  titleSlug,
  difficulty
}) {
  const filePath = path.join(rootPath, filename);
  const doesFileExist = fs.existsSync(filePath);
  const nowDateFormat = dayjs().format("YYYY-MM-DD HH:mm:ss");
  const errorCallback = error => {
    if (error) {
      Reporter.error(error);
    }
    Reporter.success(
      `suessed to mark difficulty:${difficulty} ${questionId}: ${titleSlug} in ${nowDateFormat} in ${filePath}`
    );
  };
  const fileContent = `
${nowDateFormat}
${questionId}: ${titleSlug} difficulty:${difficulty}
${questionId}: ${translatedTitle} difficulty:${difficulty}
`;
  if (doesFileExist) {
    fs.appendFile(filePath, fileContent, errorCallback);
  } else {
    fs.writeFile(filePath, fileContent, errorCallback);
  }
};

module.exports = leetcodedownloadCache;
