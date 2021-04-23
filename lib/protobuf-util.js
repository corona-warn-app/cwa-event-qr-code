'use strict'

const path = require('path')
const protobuf = require('protobufjs')

const loadTypeFromFile = (partialPath, partialType) => {
  const getType = async () => {
    const root = await protobuf.load(path.resolve(__dirname, `./../proto/${partialPath}`))
    const type = root.lookupType(partialType)
    return type
  }
  return {
    fromBuffer: async buffer => protobufUtil.dataWithoutHeader(await getType(), buffer),
    toBuffer: async data => protobufUtil.bufferWithoutHeader(await getType(), data)
  }
}

const protobufUtil = module.exports = {
  bufferWithoutHeader: (type, data) => {
    const message = type.create(data)
    return type.encode(message).finish()
  },
  dataWithoutHeader: (type, buffer) => {
    return type.decode(buffer)
  },
  types: {
    ptCWALocationData: loadTypeFromFile('internal/pt/trace_location.proto', 'internal.pt.CWALocationData'),
    ptQrCodePayload: loadTypeFromFile('internal/pt/trace_location.proto', 'internal.pt.QRCodePayload')
  }
}
