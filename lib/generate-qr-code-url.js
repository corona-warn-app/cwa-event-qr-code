'use strict'

module.exports = async (buffer) => {
  const asBase64url = buffer.toString('base64url')
  return `https://e.coronawarn.app/?v=1#${asBase64url}`
}
