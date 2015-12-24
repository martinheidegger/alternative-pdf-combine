var fs = require('fs')
var path = require('path')
var spawn = require('child_process').spawn
var tmpdir = require('os').tmpdir
var isMac = require('os').type() === 'Darwin'
var PDF_UNITE = 'pdfunite'

function run(cmd, args, output, inputControl, callback) {
	var process = spawn(cmd, args)
	process.on('exit', function () {
		fs.readFile(output, function (err, buffer) {
			inputControl.forEach(function (input) {
				input.cleanup()
			})
			callback(err, buffer)
		})
	})
}

function combinePdfs(buffers, callback) {
	buffers = buffers.map(function makeSureOfBuffer(input) {
		if (input instanceof Buffer) {
			return input
		} else if (input.encoding !== undefined) {
			return new Buffer(input.text, input.encoding)
		} else if (input.file) {
			return fs.readFileSync(input.file)
		}
		return new Buffer(input.toString())
	})
	var inputControl = buffers.map(bufferToTmp)
	var input = inputControl.map(function (tmp) {
		return tmp.path
	})
	var output = tmpFileName()
	require('command-exists')(PDF_UNITE, function (err, exists) {
		if (exists) {
			return run(PDF_UNITE, input.concat([output]), output, inputControl, callback)
		} else if (isMac) {
			return run('python', [path.resolve(__dirname, 'automator.py'), '-o', output].concat(input), output, inputControl, callback)
		}
		callback(new Error('We need at least poppler to work out fine. (actually: pdf-unite is the command we are looking for)'))
	})
}


function tmpFileName() {
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

function bufferToTmp(buffer) {
	var tmpPath = tmpFileName()
	fs.writeFileSync(tmpPath, buffer)
	return {
		path: tmpPath,
		cleanup: fs.unlink.bind(fs, tmpPath)
	}
}

module.exports = combinePdfs