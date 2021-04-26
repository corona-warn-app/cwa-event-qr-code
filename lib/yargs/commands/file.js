'use strict'

const path = require('path')
const { createEventQRCode } = require('../../index')

const supportedExtensions = ['png', 'svg']

module.exports = ({ dataProvider }) => {
  return {
    command: ['file'],
    desc: 'write QR code to a file',
    builder: yargs => {
      dataProvider.builder(yargs)
    },
    handler: async argv => {
      const data = dataProvider.getData(argv)
      const allQRCodesCreated = data
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
      await Promise.all(allQRCodesCreated)

      console.log(`Done creating ${data.length} QR code(s).`)
    }
  }
}
