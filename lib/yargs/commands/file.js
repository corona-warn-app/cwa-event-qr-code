'use strict'

const path = require('path')
const traceLocationProvider = require('../middlewares/trace-locations-provider')
const { createEventQRCode } = require('../../index')

const supportedExtensions = ['png', 'svg']

module.exports = () => {
  return {
    command: ['file'],
    desc: 'write QR code to a file',
    builder: yargs => {
      traceLocationProvider.modifyBuilder(yargs)
    },
    handler: async argv => {
      const { traceLocations } = argv
      const allTraceLocationsCreated = traceLocations
        .map(async ({ locationData, vendorData, filepath }) => {
          const eventQRCode = createEventQRCode({ locationData, vendorData })
          const ext = path.extname(filepath).substr(1)
          if (!supportedExtensions.includes(ext)) {
            throw new Error(`File extension ${ext} of ${filepath} not in ${supportedExtensions}`)
          }

          const absFilepath = path.resolve(process.cwd(), filepath)
          await eventQRCode.toFile(absFilepath, { type: ext })

          console.log(`Created ${filepath}`)
        })
      await Promise.all(allTraceLocationsCreated)

      console.log(`Done creating ${traceLocations.length} QR code(s).`)
    }
  }
}
