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
      description: 'Path to the CSV file. See below for file structure',
      group: 'CSV',
      string: true
    })
    .option('destination', {
      description: 'Destination directory for the generated files',
      group: 'CSV',
      alias: 'dest',
      string: true
    })
    .epilog(`CSV file structure
  The first row of the CSV file must be be following column headers:
    filepath
    description
    address
    startdate
    enddate
    type
    defaultcheckinlengthinminutes
`)
}

module.exports = middleware
