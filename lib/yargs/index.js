#!/usr/bin/env node
/* eslint-disable no-unused-expressions */
'use strict'

const yargs = require('yargs')
const middlewares = require('./middlewares/index')

module.exports = () => {
  const dataProviderMiddleware = middlewares.dataProvider({
    sources: [
      middlewares.dataFromCSV(),
      middlewares.dataFromArgv()
    ]
  })

  return yargs
    .middleware([
      dataProviderMiddleware
    ])
    .command(require('./commands/file')({ dataProvider: dataProviderMiddleware }))
    .command(require('./commands/poster')({ dataProvider: dataProviderMiddleware }))
    .command(require('./commands/terminal')({ dataProvider: dataProviderMiddleware }))
    .showHelpOnFail(true)
}
