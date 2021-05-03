'use strict'

module.exports = async (buffer) => {
  const asBase64url = buffer.toString('base64').replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g, "");
  return `https://e.coronawarn.app/?v=1#${asBase64url}`
}
