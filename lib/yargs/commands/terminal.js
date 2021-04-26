'use strict'

const { createEventQRCode } = require('../../index')

module.exports = ({ dataProvider }) => {
  return {
    command: ['terminal'],
    desc: 'print a QR code on the terminal',
    builder: yargs => {
      dataProvider.builder(yargs)
    },
    handler: async argv => {
      const data = dataProvider.getData(argv)
      const allQRCodesCreated = data
        .map(async ({ locationData, vendorData }) => {
          const eventQRCode = createEventQRCode({ locationData, vendorData })

          console.log(await eventQRCode.toString())
        })
      await Promise.all(allQRCodesCreated)

      console.log(`Done creating ${data.length} QR code(s).`)
    }
  }
}
