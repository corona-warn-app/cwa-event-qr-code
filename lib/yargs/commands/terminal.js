'use strict'

const { createEventQRCode } = require('../../index')

module.exports = ({ process, console, dataProvider }) => {
  return {
    command: ['terminal'],
    desc: 'print a QR code on the terminal',
    builder: yargs => {
      dataProvider.builder(yargs)
    },
    handler: async argv => {
      try {
        const data = await dataProvider.getData(argv)
        const allQRCodesCreated = data
          .map(async ({ locationData, vendorData }) => {
            const eventQRCode = createEventQRCode({ locationData, vendorData })
            console.log(await eventQRCode.toString())
          })
        await Promise.all(allQRCodesCreated)
        console.log(`Done creating ${data.length} QR code(s).`)
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    }
  }
}
