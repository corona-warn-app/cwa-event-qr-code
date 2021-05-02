'use strict'

const path = require('path')
const { createEventQRCode } = require('../../index')

const supportedExtensions = ['png', 'svg']

module.exports = ({ process, console, dataProvider }) => {
  return {
    command: ['file'],
    desc: 'write QR code to a file',
    builder: yargs => {
      dataProvider.builder(yargs)
    },
    handler: async argv => {
      try {
        const data = await dataProvider.getData(argv)
        const allQRCodesCreated = data
          .map(async ({ locationData, vendorData, filepath }) => {
            if (!filepath) {
              throw new Error('Filepath may not be empty')
            }
            const ext = path.extname(filepath).substr(1)
            if (!supportedExtensions.includes(ext)) {
              throw new Error(`File extension ${ext} of ${filepath} not in ${supportedExtensions}`)
            }

            const eventQRCode = createEventQRCode({ locationData, vendorData })
            const absFilepath = path.resolve(process.cwd(), filepath)
            await eventQRCode.toFile(absFilepath, { type: ext })

            console.log(`Created ${filepath}`)
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
