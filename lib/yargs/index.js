#!/usr/bin/env node
/* eslint-disable no-unused-expressions */
'use strict'

const yargs = require('yargs')
const middlewares = require('./middlewares/index')

module.exports = ({ process, console }) => {
  const dataProviderMiddleware = middlewares.dataProvider({
    sources: [
      middlewares.dataFromCSV({ process }),
      middlewares.dataFromArgv()
    ]
  })

  return yargs
    .middleware([
      dataProviderMiddleware
    ])
    .command(require('./commands/file')({ process, console, dataProvider: dataProviderMiddleware }))
    .command(require('./commands/poster')({ process, console, dataProvider: dataProviderMiddleware }))
    .command(require('./commands/terminal')({ process, console, dataProvider: dataProviderMiddleware }))
    .showHelpOnFail(true)
}
