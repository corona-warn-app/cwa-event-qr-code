'use strict'

const path = require('path')
const readQRCodeDataFromCSV = require('../../read-qr-code-data-from-csv')

module.exports = ({ process }) => {
  const middleware = async argv => {
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

  middleware.hasData = argv => Array.isArray(argv.__dataFromCsv)
  middleware.getData = argv => argv.__dataFromCsv

  middleware.builder = yargs => {
    yargs
      .option('csv', {
        description: 'Path to the CSV file (see below for file structure)',
        group: 'CSV',
        string: true,
        conflicts: ['description']
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

  return middleware
}
