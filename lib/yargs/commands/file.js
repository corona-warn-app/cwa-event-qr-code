'use strict'

const path = require('path')
const { createEventQRCode } = require('../../index')
const {
  addOptionsForLocationData,
  addOptionsForVendorData,
  getLocationDataFromArgv,
  getVendorDataFromArgv
} = require('../yargs-util')

const supportedExtensions = ['png', 'svg']

module.exports = () => {
  return {
    command: ['file'],
    desc: 'write QR code to a file',
    builder: yargs => {
      addOptionsForLocationData(yargs)
      addOptionsForVendorData(yargs)
      yargs.option('filepath')
    },
    handler: async argv => {
      const locationData = getLocationDataFromArgv(argv)
      const vendorData = getVendorDataFromArgv(argv)
      const eventQRCode = createEventQRCode({ locationData, vendorData })

      const ext = path.extname(argv.filepath).substr(1)
      if (!supportedExtensions.includes(ext)) {
        console.log(`File extension ${ext} not in ${supportedExtensions}`)
        return process.exit(1)
      }

      const filepath = path.resolve(process.cwd(), argv.filepath)
      await eventQRCode.toFile(filepath, { type: ext })

      console.log(`Created ${filepath}`)
    }
  }
}
