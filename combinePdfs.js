var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn
var tmpdir = require('os').tmpdir
var isMac = require('os').type() === 'Darwin'
var PDF_UNITE = 'pdfunite'

function run (cmd, args, output, inputControl, debug, callback) {
  if (debug) {
    console.log('[debug] Calling:', cmd, args.map(function (arg) {
      return '"' + arg.replace(/"/g, '\\"').replace(/\n/gm, '\\n') + '"'
    }).join(' '))
  }
  var process = spawn(cmd, args)
  var error = ''
  process.stderr.on('data', function (data) {
    error += data
  })
  process.on('exit', function (code) {
    if (code === 0) {
      fs.readFile(output, function (err, buffer) {
        inputControl.forEach(function (input) {
          input.cleanup()
        })
        output.cleanup()
        callback(err, buffer)
      })
    } else {
      callback(new Error(error))
    }
  })
}

function combinePdfs (buffers, debug, callback) {
  if (typeof debug === 'function') {
    callback = debug
    debug = false
  }
  buffers = buffers.map(function makeSureOfBuffer (input, nr) {
    if (input instanceof Buffer) {
      return input
    } else if (input.encoding !== undefined) {
      if (debug) {
        console.log('[debug] Converting ' + nr + ' to buffer with encoding ' + input.encoding)
      }
      return new Buffer(input.text, input.encoding)
    } else if (input.file) {
      if (debug) {
        console.log('[debug] Converting ' + nr + ' to buffer from file ' + input.file)
      }
      return fs.readFileSync(input.file)
    }
    if (debug) {
      console.log('[debug] Converting ' + nr + ' to buffer from string')
    }
    return new Buffer(input.toString())
  })
  var inputControl = buffers.map(bufferToTmp)
  var input = inputControl.map(function (tmp) {
    return tmp.path
  })
  var output = tmpFileName()
  require('command-exists')(PDF_UNITE, function (err, exists) {
    if (err && debug) {
      console.log('[debug] Error feedback' + err)
    }
    if (exists) {
      return run(PDF_UNITE, input.concat([output]), output, inputControl, debug, callback)
    } else if (isMac) {
      return run('python', [path.resolve(__dirname, 'automator.py'), '-o', output].concat(input), output, inputControl, debug, callback)
    }
    callback(new Error('We need at least poppler to work out fine. (actually: pdf-unite is the command we are looking for)'))
  })
}

function tmpFileName () {
  return path.resolve(tmpdir(),
    'pdf-combine-' +
    tmpFileName.processId +
    '-' +
    (tmpFileName.cnt++).toString(10) +
    '.pdf'
  )
}
tmpFileName.processId = Date.now().toString(16) + '-' + (Math.random() * 10000).toString(16)
tmpFileName.cnt = 1

function bufferToTmp (buffer) {
  var tmpPath = tmpFileName()
  fs.writeFileSync(tmpPath, buffer)
  return {
    path: tmpPath,
    cleanup: fs.unlink.bind(fs, tmpPath)
  }
}

module.exports = combinePdfs
