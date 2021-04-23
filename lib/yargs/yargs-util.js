'use strict'

module.exports = {
  addOptionsForLocationData: yargs => {
    yargs
      .option('description')
      .option('address')
      .option('start-timestamp', {
        number: true
      })
      .option('end-timestamp', {
        number: true
      })
  },
  addOptionsForVendorData: yargs => {
    yargs
      .option('type')
      .option('default-check-in-length-in-minutes', {
        number: true
      })
  },
  getLocationDataFromArgv: argv => {
    const locationData = {
      description: argv.description,
      address: argv.address,
      startTimestamp: argv.startTimestamp,
      endTimestamp: argv.endTimestamp
    }
    return locationData
  },
  getVendorDataFromArgv: argv => {
    const vendorData = {
      type: argv.type,
      defaultCheckInLengthInMinutes: argv.defaultCheckInLengthInMinutes
    }
    return vendorData
  }
}
