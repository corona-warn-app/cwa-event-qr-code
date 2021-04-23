'use strict'

const QRCode = require('qrcode')
const { promisify } = require('util')

const generateQRCodePayload = require('./generate-qr-code-payload')
const generateQRCodeUrl = require('./generate-qr-code-url')

const generateQRCodeContent = async ({ locationData, vendorData }) => {
  const buffer = await generateQRCodePayload({ locationData, vendorData })
  const url = generateQRCodeUrl(buffer)
  return url
}

const createQRCodeAsFile = async ({ locationData, vendorData, filepath, options = {} }) => {
  const url = await generateQRCodeContent({ locationData, vendorData })
  return promisify(QRCode.toFile)(filepath, url, options)
}

const createQRCodeAsPNG = async ({ locationData, vendorData, filepath, options = {} }) => {
  options.type = 'png'
  return createQRCodeAsFile({ locationData, vendorData, filepath, options })
}

const createQRCodeAsSVG = async ({ locationData, vendorData, filepath, options = {} }) => {
  options.type = 'svg'
  return createQRCodeAsFile({ locationData, vendorData, filepath, options })
}

module.exports = {
  generateQRCodeContent,
  createQRCodeAsFile,
  createQRCodeAsPNG,
  createQRCodeAsSVG
}
