'use strict'
const PDF_UNITE = 'pdfunite'
const isMac = require('os').type() === 'Darwin'
const commandExits = require('command-exists')

module.exports = function (debug, callback) {
  const overridePDFUnite = /^\s*true\s*$/i.test(process.env.ALTERNATIVE_PDF_COMBINE_OVERRIDE_PDFUNITE)
  if (overridePDFUnite && isMac) {
    if (debug) {
      console.log('[debug] Overriding pdfunite on mac')
    }
    return setImmediate(callback.bind(null, null, null))
  }
  commandExits(PDF_UNITE, function (err, exists) {
    if (err && debug) {
      console.log('[debug] Error feedback from command-exists: ' + err)
    }
    if (!exists && !isMac) {
      callback(new Error('We need at least poppler to work out fine. (actually: pdfunite is the command we are looking for)')) 
    } else {
      callback(null, exists ? PDF_UNITE : null)
    }
  })
}
