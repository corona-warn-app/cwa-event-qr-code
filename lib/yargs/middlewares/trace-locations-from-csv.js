'use strict'

const path = require('path')
const readQRCodeDataFromCSV = require('../../read-qr-code-data-from-csv')

const middleware = () => {
  return async argv => {
    if (!argv.csv) return

    const filepath = path.resolve(process.cwd(), argv.csv)
    argv.__dataFromCsv = (await readQRCodeDataFromCSV(filepath))
      .map(it => {
        return {
          ...it,
          filepath: path.join(argv.dest || '', it.filepath)
        }
      })
  }
}

middleware.provider = {
  hasTraceLocations: argv => {
    return Array.isArray(argv.__dataFromCsv)
  },
  getTraceLocations: argv => {
    return argv.__dataFromCsv
  }
}

middleware.modifyBuilder = yargs => {
  yargs
    .option('csv', {
      string: true
    })
    .option('destination', {
      alias: 'dest',
      string: true
    })
}

module.exports = middleware
