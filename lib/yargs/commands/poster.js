'use strict'

const path = require('path')
const traceLocationProvider = require('../middlewares/trace-locations-provider')
const { createEventQRCode } = require('../../index')

module.exports = () => {
  return {
    command: ['poster'],
    desc: 'create poster with QR code',
    builder: yargs => {
      traceLocationProvider.modifyBuilder(yargs)
    },
    handler: async argv => {
      const { traceLocations } = argv
      const allTraceLocationsCreated = traceLocations
        .map(async ({ locationData, vendorData, filepath }) => {
          const eventQRCode = createEventQRCode({ locationData, vendorData })

          const absFilepath = path.resolve(process.cwd(), filepath)
          await eventQRCode.toPoster(absFilepath)

          console.log(`Created ${filepath}`)
        })
      await Promise.all(allTraceLocationsCreated)

      console.log(`Done creating ${traceLocations.length} QR code poster(s).`)
    }
  }
}
