#!/usr/bin/env node
/* eslint-disable no-unused-expressions */
'use strict'

const yargs = require('yargs')
const dataFromArgvFactory = require('./util/data-from-argv')
const dataFromCSVFactory = require('./util/data-from-csv')
const dataProviderFactory = require('./util/data-provider')

module.exports = ({ process, console }) => {
  const dataProvider = dataProviderFactory({
    sources: [
      dataFromCSVFactory({ process }),
      dataFromArgvFactory()
    ]
  })

  return yargs
    .command(require('./commands/file')({ process, console, dataProvider }))
    .command(require('./commands/poster')({ process, console, dataProvider }))
    .command(require('./commands/terminal')({ process, console, dataProvider }))
    .showHelpOnFail(true)
}
