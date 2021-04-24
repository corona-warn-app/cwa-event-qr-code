'use strict'

const fs = require('fs')
const path = require('path')
const { PDFDocument } = require('pdf-lib')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)

module.exports = async ({ qrCode, locationData }) => {
  const templateFilepath = path.resolve(__dirname, '../assets/pt-poster-1.0.0.pdf')
  const template = await readFile(templateFilepath)

  const pdfDoc = await PDFDocument.load(template)

  const pngImage = await pdfDoc.embedPng(qrCode)
  const pngDims = pngImage.scaleToFit(400, 400)
  const page = pdfDoc.getPage(0)
  page.drawImage(pngImage, {
    x: page.getWidth() / 2 - pngDims.width / 2,
    y: page.getHeight() / 2 - pngDims.height + 340,
    width: pngDims.width,
    height: pngDims.height,
  })
  
  return pdfDoc.save()
}