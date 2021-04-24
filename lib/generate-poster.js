'use strict'

const fs = require('fs')
const path = require('path')
const {
  PDFDocument,
  rgb,
  StandardFonts
} = require('pdf-lib')
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
    height: pngDims.height
  })

  const fontSize = 10
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const maxTextWidth = 420
  const truncateText = text => {
    while (helveticaFont.widthOfTextAtSize(text, fontSize) > maxTextWidth) {
      text = text.substr(0, text.length - 1)
    }
    return text
  }

  page.drawText(truncateText(locationData.description), {
    x: 80,
    y: 325,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })
  page.drawText(truncateText(locationData.address), {
    x: 80,
    y: 310,
    size: fontSize,
    font: helveticaFont,
    color: rgb(0, 0, 0)
  })

  return pdfDoc.save()
}
