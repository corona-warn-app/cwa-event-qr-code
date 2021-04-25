'use strict'

const fromArgv = require('./trace-locations-from-argv')
const fromCsv = require('./trace-locations-from-csv')

const sources = [
  fromCsv,
  fromArgv
]

const middleware = () => {
  return argv => {
    const provider = sources
      .map(source => source.provider)
      .find(provider => provider.hasTraceLocations(argv))
    if (provider) {
      argv.traceLocations = provider.getTraceLocations(argv)
      // console.log(JSON.stringify(argv.traceLocations, null, '  '))
    }
  }
}

middleware.modifyBuilder = yargs => {
  sources
    .forEach(source => source.modifyBuilder(yargs))
}

module.exports = middleware
