'use strict'

const fs = require('fs')
const QRCode = require('qrcode')
const { promisify } = require('util')

const generateQRCodePayload = require('./generate-qr-code-payload')
const generateQRCodeUrl = require('./generate-qr-code-url')
const generatePoster = require('./generate-poster')

const qrCodeToFile = promisify(QRCode.toFile)
const qrCodeToString = promisify(QRCode.toString)
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

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
  const toPoster = async (filepath) => {
    const pngFilepath = `${filepath}.png`
    await toFile(pngFilepath, { width: 1000, type: 'png' })
    const qrCode = await readFile(pngFilepath)
    const pdf = await generatePoster({ qrCode, locationData })
    await writeFile(filepath, pdf)
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
  createEventQRCode
}
