'use strict'

const crypto = require('crypto')
const protobufUtil = require('./protobuf-util')

const assignIfTruthy = (srcObj, destObj, attribute) => {
  if (srcObj[attribute]) destObj[attribute] = srcObj[attribute]
}

module.exports = async ({ locationData, vendorData }) => {
  const isPermanentLocation = vendorData.type === 1 ||
    (vendorData.type >= 3 && vendorData.type <= 8)

  const _locationData = {
    version: 1
  }
  assignIfTruthy(locationData, _locationData, 'description')
  assignIfTruthy(locationData, _locationData, 'address')
  if (!isPermanentLocation) {
    assignIfTruthy(locationData, _locationData, 'startTimestamp')
    assignIfTruthy(locationData, _locationData, 'endTimestamp')
  }

  const _crowdNotifierData = {
    version: 1,
    publicKey: Buffer.from('gwLMzE153tQwAOf2MZoUXXfzWTdlSpfS99iZffmcmxOG9njSK4RTimFOFwDh6t0Tyw8XR01ugDYjtuKwjjuK49Oh83FWct6XpefPi9Skjxvvz53i9gaMmUEc96pbtoaA', 'base64'),
    cryptographicSeed: crypto.randomBytes(16)
  }

  const _vendorData = {
    version: 1,
    type: vendorData.type
  }
  assignIfTruthy(vendorData, _vendorData, 'defaultCheckInLengthInMinutes')

  const qrCodePayload = {
    version: 1,
    locationData: _locationData,
    crowdNotifierData: _crowdNotifierData,
    vendorData: await protobufUtil.types.ptCWALocationData.toBuffer(_vendorData)
  }

  return protobufUtil.types.ptQrCodePayload.toBuffer(qrCodePayload)
}
