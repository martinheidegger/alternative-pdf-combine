# alternative-pdf-combine

There are various tools in the npm that allow for combining pdf's this tool is limited to Mac & Linux but it
should work on macs out-of-the-box and on linux by using poppler`s `pdfunite`. This tool is by no means well
tested use on own risk!


## As a command line tool

Install it using `npm i alternative-pdf-combine -g` and then run 

```bash
$ Usage: alternative-pdf-combine out.pdf in1.pdf ... inx.pdf
```


To enable a debug output you can set the environment variable `DEBUG_ALTERNATIVE_PDF_COMBINE=true`.

## As a JavaScript package

After installing the package with `npm i alternative-pdf-combine` you can use it like this.

```javascript

var combinePdfs = require('alternative-pdf-combine')
combinePdfs([
	fs.readFileSync('pdf1.pdf'),
	{file: 'pdf2.pdf'}, // will automatically call fs.readFileSync
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

## Mac & PDF Unite

By default, on Mac, it will try to use mac's pdf combination. But it will use `pdfunite` if installed on a mac since
its way faster and creates smaller files. You can install pdfunite on mac using [homebrew](http://brew.sh/): `brew install poppler`

If you wish to always use Mac's pdf combination solution set the environment variable:
`ALTERNATIVE_PDF_COMBINE_OVERRIDE_PDFUNITE=true`


## Contribution

Contributions and improvements welcome!
