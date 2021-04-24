'use strict'

const path = require('path')
const { createEventQRCode } = require('../../index')
const {
  addOptionsForLocationData,
  addOptionsForVendorData,
  getLocationDataFromArgv,
  getVendorDataFromArgv
} = require('../yargs-util')

module.exports = () => {
  return {
    command: ['poster'],
    desc: 'create poster with QR code',
    builder: yargs => {
      addOptionsForLocationData(yargs)
      addOptionsForVendorData(yargs)
      yargs.option('filepath')
    },
    handler: async argv => {
      const locationData = getLocationDataFromArgv(argv)
      const vendorData = getVendorDataFromArgv(argv)
      const eventQRCode = createEventQRCode({ locationData, vendorData })

      const filepath = path.resolve(process.cwd(), argv.filepath)
      await eventQRCode.toPoster(filepath)

      console.log(`Created ${filepath}`)
    }
  }
}