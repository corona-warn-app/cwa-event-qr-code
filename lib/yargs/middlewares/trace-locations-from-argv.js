'use strict'

const middleware = () => {
  return argv => {
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
    argv.__dataFromArgv = [
      { locationData, vendorData, filepath: argv.filepath }
    ]
  }
}

middleware.provider = {
  hasTraceLocations: argv => {
    return Array.isArray(argv.__dataFromArgv)
  },
  getTraceLocations: argv => {
    return argv.__dataFromArgv
  }
}

middleware.modifyBuilder = yargs => {
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
      number: true
    })
    .option('end-timestamp', {
      description: 'End timestamp of the event (UNIX timestamp)',
      group: 'Event Data',
      number: true
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

module.exports = middleware
