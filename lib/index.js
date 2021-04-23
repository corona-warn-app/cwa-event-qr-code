'use strict'

const QRCode = require('qrcode')
const { promisify } = require('util')

const generateQRCodePayload = require('./generate-qr-code-payload')
const generateQRCodeUrl = require('./generate-qr-code-url')

const qrCodeToFile = promisify(QRCode.toFile)
const qrCodeToString = promisify(QRCode.toString)

const createEventQRCode = ({ locationData, vendorData }) => {
  const toQRCodePayloadBuffer = () => generateQRCodePayload({ locationData, vendorData })
  const toURL = async () => {
    const buffer = await generateQRCodePayload({ locationData, vendorData })
    const url = generateQRCodeUrl(buffer)
    return url
  }
  const toFile = async (filepath, options) => {
    const url = await toURL()
    return qrCodeToFile(filepath, url, options)
  }
  const toPNG = async (filepath, options) => {
    options.type = 'png'
    return toFile(filepath, options)
  }
  const toSVG = async (filepath, options) => {
    options.type = 'svg'
    return toFile(filepath, options)
  }
  const toString = async () => {
    const url = await toURL()
    return qrCodeToString(url, { type: 'terminal' })
  }

  return {
    toQRCodePayloadBuffer,
    toURL,
    toFile,
    toPNG,
    toSVG,
    toString
  }
}

module.exports = {
  createEventQRCode
}
