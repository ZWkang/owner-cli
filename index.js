#!/usr/bin/env node

const commander = require('commander')

const helpString = `
|-----------------------------|
|                             |
|   -h --help show help list  |
|                             |
|-----------------------------|
        @ZWkang author
`
commander.version('0.1.0')
  .option('-h, --helpcommander', 'show help list')
  .parse(process.argv);



if(commander.help) console.log(helpString)