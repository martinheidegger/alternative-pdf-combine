# alternative-pdf-combine

There are various tools in the npm that allow for combining pdf's this tool is limited to Mac & Linux but it should work on macs out-of-the-box and on linux by using poppler`s `pdfunite`. This tool is by no means well tested use on own risk!


# Example:
```JavaScript

var combinePdfs = require('alternative-pdf-combine')
combinePdfs([
	fs.readFileSync('pdf1.pdf'),
	{file: '', pdf2.pdf'}, // will automatically call fs.readFileSync
	new Buffer('...'),  // will use this buffer
	'...', // will be converted to Buffer using new Buffer(txt)
	{text: '...', encoding: 'utf8'} // will convert the  text to a buffer using new Buffer(obj.text, obj.encoding)
], function (err, combinedBuffer) {
	if (err) {
		console.log(err)
		process.exit(1)
	}
	fs.writeFile('test_out.pdf', combinedBuffer, function (err) {
		if (err) {
			console.log(err)
			process.exit(1)
		}
		console.log(out)
	})
})

```

_Note:_ it will use `pdfunite` if installed on a mac since its way faster and creates
smaller files.

# Contribution

Contributions and improvements welcome!
