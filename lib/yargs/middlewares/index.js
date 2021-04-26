'use strict'

const dataFromArgv = require('./data-from-argv')
const dataFromCSV = require('./data-from-csv')
const dataProvider = require('./data-provider')

module.exports = {
  dataFromArgv,
  dataFromCSV,
  dataProvider
}
