'use strict'

const path = require('path')

const {
  createQRCodeAsFile
} = require('../../index')
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
    desc: 'print a QR code on the terminal',
    builder: yargs => {
      addOptionsForLocationData(yargs)
      addOptionsForVendorData(yargs)
      yargs.option('filepath')
    },
    handler: async argv => {
      const locationData = getLocationDataFromArgv(argv)
      const vendorData = getVendorDataFromArgv(argv)

      const ext = path.extname(argv.filepath).substr(1)
      if (!supportedExtensions.includes(ext)) {
        console.log(`File extension ${ext} not in ${supportedExtensions}`)
        return process.exit(1)
      }

      const absFilepath = path.resolve(process.cwd(), argv.filepath)
      await createQRCodeAsFile({
        locationData,
        vendorData,
        filepath: absFilepath,
        options: { type: ext }
      })
    }
  }
}
