'use strict'

const fs = require('fs/promises')
const QRCode = require('qrcode')
const { promisify } = require('util')

const generateQRCodePayload = require('./generate-qr-code-payload')
const generateQRCodeUrl = require('./generate-qr-code-url')
const generatePoster = require('./generate-poster')
const validateQRCodeData = require('./validate-qr-code-data')

const qrCodeToFile = promisify(QRCode.toFile)
const qrCodeToBuffer = promisify(QRCode.toBuffer)
const qrCodeToString = promisify(QRCode.toString)

const createEventQRCode = ({ locationData, vendorData }) => {
  const {
    isValid,
    errors,
    validatedLocationData,
    validatedVendorData
  } = validateQRCodeData({ locationData, vendorData })

  if (!isValid) {
    const err = new Error('QR code data not valid')
    err.name = 'ValidationError'
    err.violations = errors
    throw err
  } else {
    locationData = validatedLocationData
    vendorData = validatedVendorData
  }

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
  const toBuffer = async (options) => {
    const url = await toURL()
    return qrCodeToBuffer(url, options)
  }
  const toPNG = async (filepath, options) => {
    const optionsParam = options || {};
    optionsParam.type = 'png'
    return toFile(filepath, optionsParam)
  }
  const toSVG = async (filepath, options) => {
    const optionsParam = options || {};
    optionsParam.type = 'svg'
    return toFile(filepath, optionsParam)
  }
  const toString = async () => {
    const url = await toURL()
    return qrCodeToString(url, { type: 'terminal' })
  }
  const toPoster = async (filepath) => {
    const qrCode = await toBuffer({ width: 1000, type: 'png' })
    const pdf = await generatePoster({ qrCode, locationData })
    await fs.writeFile(filepath, pdf)
  }

  return {
    toQRCodePayloadBuffer,
    toURL,
    toFile,
    toPNG,
    toSVG,
    toString,
    toPoster
  }
}

module.exports = {
  createEventQRCode,
  validateQRCodeData
}
