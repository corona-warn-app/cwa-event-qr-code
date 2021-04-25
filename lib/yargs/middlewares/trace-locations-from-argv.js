'use strict'

const {
  getLocationDataFromArgv,
  getVendorDataFromArgv
} = require('../yargs-util')

const middleware = () => {
  return argv => {
    const locationData = getLocationDataFromArgv(argv)
    const vendorData = getVendorDataFromArgv(argv)
    argv.__dataFromArgv = [
      { locationData, vendorData, filepath: argv.filepath }
    ]
  }
}

middleware.provider = {
  hasTraceLocations: argv => {
    return Array.isArray(argv.__dataFromArgv)
  },
  getTraceLocations: argv => {
    return argv.__dataFromArgv
  }
}

middleware.modifyBuilder = yargs => {
  yargs
    .option('description')
    .option('address')
    .option('start-timestamp', {
      number: true
    })
    .option('end-timestamp', {
      number: true
    })
    .option('type')
    .option('default-check-in-length-in-minutes', {
      number: true
    })
    .option('filepath')
}

module.exports = middleware
