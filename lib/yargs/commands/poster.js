'use strict'

const path = require('path')
const { createEventQRCode } = require('../../index')

module.exports = ({ dataProvider }) => {
  return {
    command: ['poster'],
    desc: 'create poster with QR code',
    builder: yargs => {
      dataProvider.builder(yargs)
    },
    handler: async argv => {
      try {
        const data = dataProvider.getData(argv)
        const allPostersCreated = data
          .map(async ({ locationData, vendorData, filepath }) => {
            if (!filepath) {
              throw new Error('Filepath may not be empty')
            }
            const eventQRCode = createEventQRCode({ locationData, vendorData })

            const absFilepath = path.resolve(process.cwd(), filepath)
            await eventQRCode.toPoster(absFilepath)

            console.log(`Created ${filepath}`)
          })
        await Promise.all(allPostersCreated)

        console.log(`Done creating ${data.length} QR code poster(s).`)
      } catch (err) {
        console.error(err)
        process.exit(1)
      }
    }
  }
}
