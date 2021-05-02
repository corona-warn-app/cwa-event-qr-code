'use strict'

const dateStrToTimestamp = dateStr => parseInt(new Date(dateStr).getTime() / 1000)

module.exports = () => {
  const hasData = argv => !!argv.description || !!argv.address
  const getData = argv => {
    if (argv.startDate) argv.startTimestamp = dateStrToTimestamp(argv.startDate)
    if (argv.endDate) argv.endTimestamp = dateStrToTimestamp(argv.endDate)

    const locationData = {
      description: argv.description,
      address: argv.address,
      startTimestamp: argv.startTimestamp,
      endTimestamp: argv.endTimestamp
    }
    const vendorData = {
      type: argv.type,
      defaultCheckInLengthInMinutes: argv.defaultCheckInLengthInMinutes
    }
    const data = [
      { locationData, vendorData, filepath: argv.filepath }
    ]
    return data
  }

  const builder = yargs => {
    yargs
      .option('description', {
        description: 'Description of the event',
        group: 'Event Data',
        string: true
      })
      .option('address', {
        description: 'Address of the event',
        group: 'Event Data',
        string: true
      })
      .option('start-timestamp', {
        description: 'Start timestamp of the event (UNIX timestamp)',
        group: 'Event Data',
        number: true,
        conflicts: 'start-date'
      })
      .option('start-date', {
        description: 'Start date in ISO8601',
        group: 'Event Data',
        string: true,
        conflicts: 'start-timestamp'
      })
      .option('end-timestamp', {
        description: 'End timestamp of the event (UNIX timestamp)',
        group: 'Event Data',
        number: true,
        conflicts: 'end-date'
      })
      .option('end-date', {
        description: 'End date in ISO8601',
        group: 'Event Data',
        string: true,
        conflicts: 'end-timestamp'
      })
      .option('type', {
        description: 'Type of the event (see values below)',
        group: 'Event Data',
        number: true
      })
      .option('default-check-in-length-in-minutes', {
        description: 'Default check-in length in minutes of the event',
        group: 'Event Data',
        number: true
      })
      .option('filepath', {
        description: 'Destination filepath of the generated file',
        group: 'Event Data',
        string: true
      })
      .epilog(`Types of events
  Places
     3 - Retail
     4 - Hospitality
     5 - Craft business
     6 - Workplace
     7 - Education facility
     8 - Public building
     1 - Other place
  Events
     9 - Cultural event
    10 - Club activities
    11 - Private party
    12 - Religious service
     2 - Other event
    `)
  }

  return {
    hasData,
    getData,
    builder
  }
}
