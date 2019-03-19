const fs = require('fs')
const glob = require('glob')
const path = require('path')
const shell = require('shelljs')
const log = console.log

const TEMPLATE_REGEX = `\\{\\{\\s?\\$t\\(('|")(.+?)('|")\\)\\s?\\}\\}`
const JS_REGEX = `this\.\\$t\\(('|")(.+?)('|")\\)`

function getTemplateRegExp() {
  return new RegExp(TEMPLATE_REGEX, 'mg')
}

function getJsRegExp() {
  return new RegExp(JS_REGEX, 'mg')
}

/**
 *
 */
function getTemplateMatches(input) {
  let match
  const results = []
  const regex = getTemplateRegExp()

  while ((match = regex.exec(input)) !== null) {
    if (match.index === regex.lastIndex) {
      regex.lastIndex++
    }

    if (match) {
      results.push(match[2])
    }
  }

  return results
}

/**
 *
 */
function getJsMatches(input) {
  let match
  const results = []
  const regex = getJsRegExp()

  while ((match = regex.exec(input)) !== null) {
    if (match.index === regex.lastIndex) {
      regex.lastIndex++
    }

    if (match) {
      results.push(match[2])
    }
  }

  return results
}

/**
 * Get all of the matches in a string.
 * @param string input
 */
function getAllMatches(input) {
  let results = [
    getTemplateMatches(input),
    getJsMatches(input),
  ]
  return [].concat(...results)
}


/**
 * Read in a file and process all the matches
 */
function processFile(templatePath) {
  const template = fs.readFileSync(templatePath)
  return getAllMatches(template)
}


/**
 * Main running loop
 * - Fetch all of the files
 * - Process each one for matches
 * - Build a match object
 */
function tauschen(src, ext = '*.vue') {
  if (src[0] !== '/') {
    cwd = shell.pwd()
    src = path.join(cwd.stdout, src)
  }

  if (!fs.existsSync(src)) {
    return null
  }

  let matches = {}

  // Gather file list
  const filePaths = glob.sync(`${src}/**/${ext}`)

  for (const filePath of filePaths) {
    const fileMatches = processFile(filePath)

    for (const match of fileMatches) {
      matches[match] = ''
    }
  }

  return matches
}

module.exports = {
  TEMPLATE_REGEX,
  getTemplateRegExp,
  getJsRegExp,
  getAllMatches,
  processFile,
  tauschen,
}
