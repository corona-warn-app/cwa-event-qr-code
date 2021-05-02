'use strict'

const path = require('path')
const readQRCodeDataFromCSV = require('../../read-qr-code-data-from-csv')

module.exports = ({ process }) => {
  let __data
  const __getData = async argv => {
    if (!argv.csv) return
    if (__data) return __data
    const filepath = path.resolve(process.cwd(), argv.csv)
    __data = (await readQRCodeDataFromCSV(filepath))
      .map(it => {
        return {
          ...it,
          filepath: path.join(argv.dest || '', it.filepath)
        }
      })
    return __data
  }

  const hasData = async argv => Array.isArray(await __getData(argv))
  const getData = argv => !argv.csv ? [] : __getData(argv)

  const builder = yargs => {
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
  The first row of the CSV file must have the following column headers:
    filepath
    description
    address
    startdate
    enddate
    type
    defaultcheckinlengthinminutes
`)
  }

  return {
    hasData,
    getData,
    builder
  }
}
