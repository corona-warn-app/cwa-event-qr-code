/* eslint-env jest */
/* eslint-disable no-return-assign */
'use strict'

const path = require('path')
const fs = require('fs/promises')
const FileType = require('file-type')

const parser = require('../lib/yargs/index')

const fixturePath = fixture => path.resolve(__dirname, fixture)
const rmrf = fixture => fs.unlink(fixturePath(fixture)).catch(() => {})
const rmrfAll = fixtures => Promise.all(fixtures.map(rmrf))
const exists = fixture => fs.stat(fixturePath(fixture))
  .then(() => true).catch(() => false)

const toExist = async fixture => await exists(fixturePath(fixture))
  ? { pass: true, message: () => `expected ${fixture} not to exist` }
  : { pass: false, message: () => `expected ${fixture} to exist` }
const toBeOfMimeType = async (fixture, expMime) => {
  const { mime } = await FileType.fromFile(fixturePath(fixture))
  return mime === expMime
    ? { pass: true, message: () => `expected ${fixture} of mime ${expMime}, got ${mime}` }
    : { pass: false, message: () => `expected ${fixture} not of mime ${expMime}, got ${mime}` }
}
const toBeOfTypePDF = async fixture => toBeOfMimeType(fixture, 'application/pdf')
const toBeOfTypePNG = async fixture => toBeOfMimeType(fixture, 'image/png')
const toBeOfTypeSVG = async fixture => toBeOfMimeType(fixture, 'application/xml')

expect.extend({
  toExist,
  toBeOfTypePDF,
  toBeOfTypePNG,
  toBeOfTypeSVG
})

const mockProcess = () => ({ cwd: () => __dirname, exit: jest.fn() })
const mockConsole = () => ({ log: jest.fn(), error: jest.fn() })

const run = async ({ process, console, argv }) => new Promise((resolve, reject) => {
  parser({ process, console })
    .onFinishCommand(() => resolve())
    .parse(argv, async err => {
      if (err) return reject(err)
    })
})

describe('cwa-event-qr-code', () => {
  jest.setTimeout(15000)
  jest.retryTimes(3)

  const FIXTURE_JPG = 'test.jpg'
  const FIXTURE_PDF = 'test.pdf'
  const FIXTURE_PNG = 'test.png'
  const FIXTURE_SVG = 'test.svg'
  const FIXTURE_CSV_INPUT = '../examples/sample-data.csv'
  const FIXTURE_CSV_PDF = [
    'some-bakery.pdf',
    'birthday-party.pdf'
  ]
  const ALL_FIXTURES = [
    FIXTURE_JPG,
    FIXTURE_PDF,
    FIXTURE_PNG,
    FIXTURE_SVG,
    ...FIXTURE_CSV_PDF
  ]

  let process, console

  beforeEach(async () => {
    process = mockProcess()
    console = mockConsole()
    await rmrfAll(ALL_FIXTURES)
  })

  afterAll(async () => {
    await rmrfAll(ALL_FIXTURES)
  })

  describe('file', () => {
    test('creates png file', async () => {
      const argv = `file \
        --description "Some Bakery" \
        --address "Some Street, Some City" \
        --type 4 \
        --default-check-in-length-in-minutes 15 \
        --filepath ${FIXTURE_PNG}`
      await run({ process, console, argv })

      await expect(FIXTURE_PNG).toExist()
      await expect(FIXTURE_PNG).toBeOfTypePNG()
      expect(process.exit).not.toHaveBeenCalled()
    })
    test('creates svg file', async () => {
      const argv = `file \
        --description "Some Bakery" \
        --address "Some Street, Some City" \
        --type 4 \
        --default-check-in-length-in-minutes 15 \
        --filepath ${FIXTURE_SVG}`
      await run({ process, console, argv })

      await expect(FIXTURE_SVG).toExist()
      await expect(FIXTURE_SVG).toBeOfTypeSVG()
      expect(process.exit).not.toHaveBeenCalled()
    })
    test('fails when called with invalid data', async () => {
      const argv = `file \
        --description "Some Bakery" \
        --address "Some Street, Some City" \
        --type 4 \
        --filepath ${FIXTURE_PNG}`
      await run({ process, console, argv })

      await expect(FIXTURE_PNG).not.toExist()
      expect(console.error).toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledWith(1)
    })
    test('fails when called with unsupported file extension', async () => {
      const argv = `file \
        --description "Some Bakery" \
        --address "Some Street, Some City" \
        --type 4 \
        --default-check-in-length-in-minutes 15 \
        --filepath ${FIXTURE_JPG}`
      await run({ process, console, argv })

      await expect(FIXTURE_JPG).not.toExist()
      expect(console.error).toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })

  describe('poster', () => {
    test('creates pdf file from arguments', async () => {
      const argv = `poster \
        --description "Some Bakery" \
        --address "Some Street, Some City" \
        --type 4 \
        --default-check-in-length-in-minutes 15 \
        --filepath ${FIXTURE_PDF}`
      await run({ process, console, argv })

      await expect(FIXTURE_PDF).toExist()
      await expect(FIXTURE_PDF).toBeOfTypePDF()
      expect(process.exit).not.toHaveBeenCalled()
    })
    test('fails when called with invalid arguments', async () => {
      const argv = `poster \
        --description "Some Bakery" \
        --address "Some Street, Some City" \
        --type 4 \
        --filepath ${FIXTURE_PDF}`
      await run({ process, console, argv })

      await expect(FIXTURE_PDF).not.toExist()
      expect(console.error).toHaveBeenCalled()
      expect(process.exit).toHaveBeenCalledWith(1)
    })
    test('creates pdf files from CSV', async () => {
      const argv = `poster \
        --csv ${FIXTURE_CSV_INPUT} \
        --dest .`
      await run({ process, console, argv })

      await Promise.all(FIXTURE_CSV_PDF.map(async it => {
        await expect(it).toExist()
        await expect(it).toBeOfTypePDF()
      }))
      expect(process.exit).not.toHaveBeenCalled()
    })
  })
})
