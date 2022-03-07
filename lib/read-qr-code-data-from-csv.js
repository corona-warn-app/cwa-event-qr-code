'use strict'

const { parse } = require('@fast-csv/parse')
const fs = require('fs')

const columns = [
  'filepath',
  'description',
  'address',
  'startdate',
  'enddate',
  'type',
  'defaultcheckinlengthinminutes'
]

module.exports = async filepath => {
  const stream = fs.createReadStream(filepath)
    .pipe(
      parse({
        delimiter: ';',
        headers: headers => headers.map(h => h.toLowerCase())
      })
        .transform(data => {
          const missingColumns = columns
            .filter(it => !Object.prototype.hasOwnProperty.call(data, it))
          if (missingColumns.length > 0) {
            throw new Error(`Mandatory column(s) missing in CSV: ${missingColumns}`)
          }
          const { filepath } = data
          const locationData = {
            description: data.description.replace(/\s+/g, ' '),
            address: data.address.replace(/\s+/g, ' '),
            startTimestamp: parseInt(new Date(data.startdate).getTime() / 1000),
            endTimestamp: parseInt(new Date(data.enddate).getTime() / 1000)
          }
          const vendorData = {
            type: parseInt(data.type),
            defaultCheckInLengthInMinutes: parseInt(data.defaultcheckinlengthinminutes || 0, 10)
          }
          return { filepath, locationData, vendorData, data }
        })
        .validate(({ data }, cb) => {
          // TODO: validate data
          return cb(null, true)
        })
    )

  const data = []
  return new Promise((resolve, reject) => {
    stream
      .on('data', record => {
        data.push(record)
      })
    // .on('data-invalid', (row, rowNumber, reason) => {
    // // console.log(`Invalid [row=${JSON.stringify(row)}]`)
    // console.log(rowNumber, reason)
    // })
      .on('error', error => {
        reject(error)
      })
      .on('end', () => {
        resolve(data)
      })
  })
}
