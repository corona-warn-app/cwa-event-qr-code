/* eslint-env jest */
/* eslint-disable no-return-assign */
'use strict'

expect.extend({
  toYieldErrorFor ({ isValid, errors }, property) {
    const pass = isValid === false &&
      Array.isArray(errors) &&
      errors.filter(it => it.property === property).length === 1
    if (pass) {
      return {
        message: () => new Error('Negation not supported for toYieldErrorFor'),
        pass: true
      }
    } else {
      return {
        message: () =>
          `expected error for ${property}, received isValid=${isValid} and errors=${errors}`,
        pass: false
      }
    }
  },
  toPassValidation ({ isValid, errors, validatedLocationData, validatedVendorData }, { locationData, vendorData }) {
    try {
      expect(isValid).toBe(true)
      expect(errors).toHaveLength(0)
      expect(validatedLocationData).toMatchObject(locationData)
      expect(validatedVendorData).toMatchObject(vendorData)
      return {
        message: () => new Error('Negation not supported for toPassValidation'),
        pass: true
      }
    } catch (e) {
      return {
        message: () => e,
        pass: false
      }
    }
  }
})

const { validateQRCodeData } = require('../lib/index')

const generateRandomStringWithLength = length => Array.from(Array(length), () => 'a').join('')

const permanentLocationTypes = [1, 3, 4, 5, 6, 7, 8]
const temporaryLocationTypes = [2, 9, 10, 11, 12]

describe('validateQRCodeData', () => {
  let locationData, vendorData

  beforeEach(() => {
    locationData = {
      description: 'My Bakery',
      address: 'Springfield'
    }
    vendorData = {
      type: permanentLocationTypes[0],
      defaultCheckInLengthInMinutes: 15
    }
  })

  test('returns true if all attributes are valid', () => {
    expect(validateQRCodeData({ locationData, vendorData }))
      .toPassValidation({ locationData, vendorData })
  })

  describe('description', () => {
    test('returns true if description has 100 characters', () => {
      locationData.description = generateRandomStringWithLength(100)
      expect(validateQRCodeData({ locationData, vendorData })).toPassValidation({ locationData, vendorData })
    })

    test.each([
      ['is missing', locationData => delete locationData.description],
      ['is empty', locationData => locationData.description = ''],
      ['exceeds 100 characters', locationData => locationData.description = generateRandomStringWithLength(101)]
    ])('returns false if description %s', (_, mutate) => {
      mutate(locationData)
      expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor('description')
    })
  })

  describe('address', () => {
    test('returns true if address has 100 characters', () => {
      locationData.address = generateRandomStringWithLength(100)
      expect(validateQRCodeData({ locationData, vendorData })).toPassValidation({ locationData, vendorData })
    })

    test.each([
      ['is missing', locationData => delete locationData.address],
      ['is empty', locationData => locationData.address = ''],
      ['exceeds 100 characters', locationData => locationData.address = generateRandomStringWithLength(101)]
    ])('returns false if address %s', (_, mutate) => {
      mutate(locationData)
      expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor('address')
    })
  })

  describe.each(permanentLocationTypes)('permanent location type %i', type => {
    beforeEach(() => {
      vendorData.type = type
    })
    describe.each(['startTimestamp', 'endTimestamp'])('%s', timestampProperty => {
      test.each([
        ['is missing', locationData => delete locationData[timestampProperty]],
        ['is empty', locationData => locationData[timestampProperty] = ''],
        ['is zero (int)', locationData => locationData[timestampProperty] = 0],
        ['is zero (str)', locationData => locationData[timestampProperty] = '0']
      ])(`returns true if ${timestampProperty} %s`, (_, mutate) => {
        mutate(locationData)
        const expLocationData = { ...locationData }
        delete expLocationData[timestampProperty]
        expect(validateQRCodeData({ locationData, vendorData })).toPassValidation({ locationData: expLocationData, vendorData })
      })
      test.each([
        ['is less than 0 (int)', locationData => locationData[timestampProperty] = -1],
        ['is less than 0 (str)', locationData => locationData[timestampProperty] = '-1'],
        ['is greater than 0 (int)', locationData => locationData[timestampProperty] = 1],
        ['is greater than 0 (str)', locationData => locationData[timestampProperty] = '1']
      ])(`returns false if ${timestampProperty} %s`, (_, mutate) => {
        mutate(locationData)
        expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor(timestampProperty)
      })
    })
    describe('defaultCheckInLengthInMinutes', () => {
      test.each([
        ['is 15 (int)', vendorData => vendorData.defaultCheckInLengthInMinutes = 15, 15],
        ['is 15 (str)', vendorData => vendorData.defaultCheckInLengthInMinutes = '15', 15],
        ['is 1440 (int)', vendorData => vendorData.defaultCheckInLengthInMinutes = 1440, 1440],
        ['is 1440 (str)', vendorData => vendorData.defaultCheckInLengthInMinutes = '1440', 1440]
      ])('returns true if defaultCheckInLengthInMinutes %s', (_, mutate, expDefaultCheckInLengthInMinutes) => {
        mutate(vendorData)
        const expVendorData = { ...vendorData }
        expVendorData.defaultCheckInLengthInMinutes = expDefaultCheckInLengthInMinutes
        expect(validateQRCodeData({ locationData, vendorData })).toPassValidation({ locationData: locationData, vendorData: expVendorData })
      })
      test.each([
        ['is equals 0 (int)', vendorData => vendorData.defaultCheckInLengthInMinutes = 0],
        ['is equals 0 (str)', vendorData => vendorData.defaultCheckInLengthInMinutes = '0'],
        ['is less than 0 (int)', vendorData => vendorData.defaultCheckInLengthInMinutes = -1],
        ['is less than 0 (str)', vendorData => vendorData.defaultCheckInLengthInMinutes = '-1'],
        ['is greater than 1440 (int)', vendorData => vendorData.defaultCheckInLengthInMinutes = 1441],
        ['is greater than 1440 (str)', vendorData => vendorData.defaultCheckInLengthInMinutes = '1441'],
        ['is missing', vendorData => delete vendorData.defaultCheckInLengthInMinutes],
        ['is empty', vendorData => vendorData.defaultCheckInLengthInMinutes = '']
      ])('returns false if defaultCheckInLengthInMinutes %s', (_, mutate) => {
        mutate(vendorData)
        expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor('defaultCheckInLengthInMinutes')
      })
    })
  })

  describe.each(temporaryLocationTypes)('temporary location type %i', type => {
    beforeEach(() => {
      locationData.startTimestamp = 1
      locationData.endTimestamp = 2
      vendorData.type = type
    })
    describe('startTimestamp and endTimestamp', () => {
      test('returns true if endTimestamp is greater than startTimestamp', () => {
        locationData.startTimestamp = 1619535600
        locationData.endTimestamp = 1619539200
        expect(validateQRCodeData({ locationData, vendorData })).toPassValidation({ locationData: locationData, vendorData })
      })
      test('returns false if endTimestamp equals startTimestamp', () => {
        locationData.startTimestamp = 1
        locationData.endTimestamp = 1
        expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor('startTimestamp')
      })
      test('returns false if endTimestamp is less or than startTimestamp', () => {
        locationData.startTimestamp = 2
        locationData.endTimestamp = 1
        expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor('startTimestamp')
      })
    })
    describe.each(['startTimestamp', 'endTimestamp'])('%s', timestampProperty => {
      test.each([
        ['is less than 0 (int)', locationData => locationData[timestampProperty] = -1],
        ['is less than 0 (str)', locationData => locationData[timestampProperty] = '-1'],
        ['is missing', locationData => delete locationData[timestampProperty]],
        ['is empty', locationData => locationData[timestampProperty] = '']
      ])(`returns false if ${timestampProperty} %s`, (_, mutate) => {
        mutate(locationData)
        expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor(timestampProperty)
      })
    })
    describe('defaultCheckInLengthInMinutes', () => {
      test.each([
        ['is 15 (int)', vendorData => vendorData.defaultCheckInLengthInMinutes = 15, 15],
        ['is 15 (str)', vendorData => vendorData.defaultCheckInLengthInMinutes = '15', 15],
        ['is 1440 (int)', vendorData => vendorData.defaultCheckInLengthInMinutes = 1440, 1440],
        ['is 1440 (str)', vendorData => vendorData.defaultCheckInLengthInMinutes = '1440', 1440],
        ['is missing', vendorData => delete vendorData.defaultCheckInLengthInMinutes, undefined],
        ['is empty', vendorData => vendorData.defaultCheckInLengthInMinutes = '', undefined]
      ])('returns true if defaultCheckInLengthInMinutes %s', (_, mutate, expDefaultCheckInLengthInMinutes) => {
        mutate(vendorData)
        expect(validateQRCodeData({ locationData, vendorData })).toHaveProperty('isValid', true)
        const expVendorData = { ...vendorData }
        if (expDefaultCheckInLengthInMinutes === undefined) delete expVendorData.defaultCheckInLengthInMinutes
        else expVendorData.defaultCheckInLengthInMinutes = expDefaultCheckInLengthInMinutes
        expect(validateQRCodeData({ locationData, vendorData })).toPassValidation({ locationData: locationData, vendorData: expVendorData })
      })
      test.each([
        ['is less than 0 (int)', vendorData => vendorData.defaultCheckInLengthInMinutes = -1],
        ['is less than 0 (str)', vendorData => vendorData.defaultCheckInLengthInMinutes = '-1'],
        ['is greater than 1440 (int)', vendorData => vendorData.defaultCheckInLengthInMinutes = 1441],
        ['is greater than 1440 (str)', vendorData => vendorData.defaultCheckInLengthInMinutes = '1441']
      ])('returns false if defaultCheckInLengthInMinutes %s', (_, mutate) => {
        mutate(vendorData)
        expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor('defaultCheckInLengthInMinutes')
      })
    })
  })

  describe('other location types', () => {
    test('returns false for location type 0', () => {
      vendorData.type = 0
      expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor('type')
    })
    test('returns false for location type 13', () => {
      vendorData.type = 13
      expect(validateQRCodeData({ locationData, vendorData })).toYieldErrorFor('type')
    })
  })
})
