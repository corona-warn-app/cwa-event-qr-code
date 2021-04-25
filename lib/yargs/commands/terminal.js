'use strict'

const traceLocationProvider = require('../middlewares/trace-locations-provider')
const { createEventQRCode } = require('../../index')

module.exports = () => {
  return {
    command: ['terminal'],
    desc: 'print a QR code on the terminal',
    builder: yargs => {
      traceLocationProvider.modifyBuilder(yargs)
    },
    handler: async argv => {
      const { traceLocations } = argv
      const allTraceLocationsCreated = traceLocations
        .map(async ({ locationData, vendorData }) => {
          const eventQRCode = createEventQRCode({ locationData, vendorData })

          console.log(await eventQRCode.toString())
        })
      await Promise.all(allTraceLocationsCreated)

      console.log(`Done creating ${traceLocations.length} QR code(s).`)
    }
  }
}
