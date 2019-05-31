// Agamennon需要的目录结构

/**
 * src/components/dialog floder
 *
 *   dialog.js
 *   index.js
 * docs/dialog.md
 *   dialog.md
 */

const mkdirp = require("mkdirp");
const rimraf = require("rimraf");

const fs = require("fs");
const path = require("path");
const Reporter = require("./Reporter");

const defaultRootPath = process.cwd();
const defaultComponentPositions = "./src/components";
const defaultDocsFilePositions = "./docs";

let isOwnerrcExist = false;

// let rootPath = process.cwd()

let ownerrcSource;
const ownerrcPath = path.resolve(process.cwd(), ".ownerrc");

try {
  if (fs.existsSync(ownerrcPath)) {
    //file exists
    isOwnerrcExist = true;
  }
} catch (e) {
  Reporter.warn(e);
}

let excaRoot = defaultRootPath;
let excaComponents = defaultComponentPositions;
let excaDocs = defaultDocsFilePositions;

if (isOwnerrcExist) {
  const ownerrcData = fs.readFileSync(ownerrcPath).toString();
  const ownerrc = JSON.parse(ownerrcData);
  const { Agamemnon } = ownerrc;
  const {
    rootPath = defaultRootPath,
    components = defaultComponentPositions,
    docs = defaultDocsFilePositions
  } = Agamemnon;
  excaRoot = rootPath;
  excaComponents = defaultComponentPositions;
  excaDocs = defaultDocsFilePositions;
}

function detectFileExist(path) {
  try {
    if (fs.existsSync(path)) {
      //file exists
      return true;
    }
  } catch (e) {
    return false;
  }
}

function createFloder(rootname, floderPosition, name) {
  // mkdirp.sync(dir, opts)
  const dir = path.join(rootname, floderPosition, name);
  // mkdirp.sync(dir)

  try {
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
      Reporter.success("success to create floder " + dir);
    } else {
      Reporter.success(dir + " is exist");
    }
  } catch (e) {
    Reporter.error("fail to create floder " + dir);
  }
}

const indexFileContent = name => `import ${firsrWordUpper(
  name
)} from './${firsrWordUpper(name)}';

export {
    ${firsrWordUpper(name)} as default
}
`;

const firsrWordUpper = str => str.replace(/\w/, item => item.toUpperCase());

const fileContent = name => `import React, { Component } from 'react'
import styled, { css } from 'styled-components'

class ${firsrWordUpper(name)} extends Component {
    constructor(props) {
        super(props)
    }
    render(){
        return (

        )
    }
}

export default ${firsrWordUpper(name)}
`;

const docsfileContent = `\`\`\`js

\`\`\`
`;

function makedocsExist(path) {
  try {
    fs.existsSync(path);
    Reporter.info(path + " is exit !");
  } catch (e) {
    mkdirp.sync(path);
    Reporter.info("create floder: " + path);
  }
}

function safeWriteFile(...args) {
  try {
    if (detectFileExist(args[0])) {
      Reporter.info(args[0] + " is exist");
    } else {
      fs.writeFileSync(...args);
      Reporter.info("write file , path and filename : \n   " + args[0]);
    }
  } catch (e) {
    Reporter.error("fail to write:", e, ...args);
  }
}
function main(name) {
  const indexfile = path.join(excaRoot, excaComponents, name, "index.js");
  const componentfile = path.join(
    excaRoot,
    excaComponents,
    name,
    firsrWordUpper(name) + ".js"
  );
  const docsfile = path.join(excaRoot, excaDocs, name + ".md");
  const docsPath = path.join(excaRoot, excaDocs);
  // console.log(docsfile, indexfile, componentfile)
  createFloder(excaRoot, defaultComponentPositions, name);
  safeWriteFile(indexfile, indexFileContent(name));
  safeWriteFile(componentfile, fileContent(name));
  makedocsExist(docsPath);
  safeWriteFile(docsfile, docsfileContent);
}
// cleanFloder('dropdown')
// main('dropdown')

/**
 * only test use
 */

function cleanFloder(name) {
  const indexfile = path.join(excaRoot, "./src");
  const docsPath = path.join(excaRoot, excaDocs);
  rimraf.sync(indexfile);
  Reporter.success("success remove : " + indexfile);
  rimraf.sync(docsPath);
  Reporter.success("success remove : " + docsPath);
}

module.exports = main;
