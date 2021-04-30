'use strict'

module.exports = ({ locationData, vendorData }) => {
  const permanentLocationTypes = [1, 3, 4, 5, 6, 7, 8]
  const temporaryLocationTypes = [2, 9, 10, 11, 12]
  const errors = []
  const validatedLocationData = {}
  const validatedVendorData = {}

  const {
    description,
    address,
    startTimestamp: _startTimestamp,
    endTimestamp: _endTimestamp
  } = locationData
  const startTimestamp = parseInt(_startTimestamp)
  const endTimestamp = parseInt(_endTimestamp)

  const {
    type,
    defaultCheckInLengthInMinutes: _defaultCheckInLengthInMinutes
  } = vendorData
  const defaultCheckInLengthInMinutes = parseInt(_defaultCheckInLengthInMinutes)

  if (typeof description !== 'string' ||
    description.length === 0 ||
    description.length > 100) {
    errors.push({
      property: 'description',
      constraint: 'is mandatory and must not exceed 100 characters'
    })
  } else validatedLocationData.description = description

  if (typeof address !== 'string' ||
    address.length === 0 ||
    address.length > 100) {
    errors.push({
      property: 'address',
      constraint: 'is mandatory and must not exceed 100 characters'
    })
  } else validatedLocationData.address = address

  const isPermanent = permanentLocationTypes.includes(type)
  const isTemporary = temporaryLocationTypes.includes(type)

  if (isPermanent) {
    validatedVendorData.type = type

    if (startTimestamp) {
      errors.push({
        property: 'startTimestamp',
        constraint: `must be empty for type ${type}`
      })
    }
    if (endTimestamp) {
      errors.push({
        property: 'endTimestamp',
        constraint: `must be empty for type ${type}`
      })
    }

    if (isNaN(defaultCheckInLengthInMinutes) ||
      defaultCheckInLengthInMinutes <= 0 ||
      defaultCheckInLengthInMinutes > 1440) {
      errors.push({
        property: 'defaultCheckInLengthInMinutes',
        constraint: 'is mandatory, must be greater than 0, and must not exceed 1440'
      })
    } else validatedVendorData.defaultCheckInLengthInMinutes = defaultCheckInLengthInMinutes
  } else if (isTemporary) {
    validatedVendorData.type = type

    if (endTimestamp <= startTimestamp) {
      errors.push({
        property: 'startTimestamp',
        constraint: 'must be less than endTimestamp'
      })
    }

    if (startTimestamp < 0 || isNaN(startTimestamp)) {
      errors.push({
        property: 'startTimestamp',
        constraint: 'is mandatory and must not be negative'
      })
    } else validatedLocationData.startTimestamp = startTimestamp

    if (endTimestamp < 0 || isNaN(endTimestamp)) {
      errors.push({
        property: 'endTimestamp',
        constraint: 'is mandatory and must not be negative'
      })
    } else validatedLocationData.endTimestamp = endTimestamp

    if (defaultCheckInLengthInMinutes < 0 ||
      defaultCheckInLengthInMinutes > 1440) {
      errors.push({
        property: 'defaultCheckInLengthInMinutes',
        constraint: 'must be greater than 0 and must not exceed 1440'
      })
    } else validatedVendorData.defaultCheckInLengthInMinutes = defaultCheckInLengthInMinutes
  } else {
    errors.push({ property: 'type' })
  }

  return { isValid: errors.length === 0, errors, validatedLocationData, validatedVendorData }
}
