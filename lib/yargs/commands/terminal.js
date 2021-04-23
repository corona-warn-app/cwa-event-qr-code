'use strict'

const QRCode = require('qrcode')

const {
  generateQRCodeContent
} = require('../../index')
const {
  addOptionsForLocationData,
  addOptionsForVendorData,
  getLocationDataFromArgv,
  getVendorDataFromArgv
} = require('../yargs-util')

module.exports = () => {
  return {
    command: ['terminal'],
    desc: 'print a QR code on the terminal',
    builder: yargs => {
      addOptionsForLocationData(yargs)
      addOptionsForVendorData(yargs)
    },
    handler: async argv => {
      const locationData = getLocationDataFromArgv(argv)
      const vendorData = getVendorDataFromArgv(argv)

      const content = await generateQRCodeContent({ locationData, vendorData })
      QRCode.toString(content, { type: 'terminal' }, function (err, url) {
        if (err) {
          console.log(`Failed to generate QR code: ${err}`)
          return process.exit(1)
        }
        console.log(url)
      })
    }
  }
}
