'use strict'
const path = require('path')
const test = require('tap').test
const fs = require('fs')

const SAMPLE_IMAGE_PDF = path.join(__dirname, 'data', 'calendrier2014_mimi_et_eunice-fr.pdf')
const SAMPLE_TEXT_PDF = path.join(__dirname, 'data', 'networked_self.pdf')
const SAMPLE_SINGLE_PAGE_PDF = path.join(__dirname, 'data', 'networked_self_first_page.pdf')
const COMBINED_1 = path.join(__dirname, 'data', 'combined_1.pdf')
const COMBINED_2 = path.join(__dirname, 'data', 'combined_2.pdf')
const COMBINED_BIG = path.join(__dirname, 'data', 'combined_big.pdf')
const COMBINED_BIG_2 = path.join(__dirname, 'data', 'combined_big_2.pdf')

const combinePdfs = require('..')

test('simple combination', function (t) {
  process.env.ALTERNATIVE_PDF_COMBINE_OVERRIDE_PDFUNITE = 'true'
  combinePdfs([
    fs.readFileSync(SAMPLE_SINGLE_PAGE_PDF),
    { file: SAMPLE_SINGLE_PAGE_PDF },
    fs.readFileSync(SAMPLE_SINGLE_PAGE_PDF, 'utf8'),
    {text: fs.readFileSync(SAMPLE_SINGLE_PAGE_PDF, 'utf8'), encoding: 'utf8'}
  ], function (error, result) {
    t.equals(error, null)
    t.ok(Math.abs(fs.readFileSync(COMBINED_1).length - result.length) < 50)
    t.end()
  })
})

test('combination with pdfunite combination', function (t) {
  process.env.ALTERNATIVE_PDF_COMBINE_OVERRIDE_PDFUNITE = 'false'
  combinePdfs([
    fs.readFileSync(SAMPLE_SINGLE_PAGE_PDF),
    { file: SAMPLE_SINGLE_PAGE_PDF },
    fs.readFileSync(SAMPLE_SINGLE_PAGE_PDF, 'utf8'),
    {text: fs.readFileSync(SAMPLE_SINGLE_PAGE_PDF, 'utf8'), encoding: 'utf8'}
  ], function (error, result) {
    t.equals(error, null)
    t.ok(Math.abs(fs.readFileSync(COMBINED_2).length - result.length) < 50)
    t.end()
  })
})

test('combination of two huge files', function (t) {
  process.env.ALTERNATIVE_PDF_COMBINE_OVERRIDE_PDFUNITE = 'true'
  combinePdfs([{file: SAMPLE_IMAGE_PDF}, {file: SAMPLE_TEXT_PDF}], function (error, result) {
    t.equals(error, null)
    t.ok(Math.abs(fs.readFileSync(COMBINED_BIG).length - result.length) < 500)
    t.end()
  })
})

test('combination of two huge files with pdfunite', function (t) {
  process.env.ALTERNATIVE_PDF_COMBINE_OVERRIDE_PDFUNITE = 'false'
  combinePdfs([{file: SAMPLE_IMAGE_PDF}, {file: SAMPLE_TEXT_PDF}], function (error, result) {
    t.equals(error, null)
    t.ok(Math.abs(fs.readFileSync(COMBINED_BIG_2).length - result.length) < 500)
    t.end()
  })
})

test('combination without files', function (t) {
  process.env.ALTERNATIVE_PDF_COMBINE_OVERRIDE_PDFUNITE = 'true'
  combinePdfs([], function (error, result) {
    t.equals(error, null)
    t.equals(result, undefined)
    t.end()
  })
})

test('combination without files with pdfunite', function (t) {
  process.env.ALTERNATIVE_PDF_COMBINE_OVERRIDE_PDFUNITE = 'false'
  combinePdfs([], function (error, result) {
    t.equals(error, null)
    t.equals(result, undefined)
    t.end()
  })
})
