const fs = require('fs')
const glob = require('glob')
const path = require('path')
const log = console.log

const TEMPLATE_REGEX = `\\{\\{\\s?\\$t\\(('|")(.+?)('|")\\)\\s?\\}\\}`

function getRegExp() {
  return new RegExp(TEMPLATE_REGEX, 'mg')
}

/**
 * Get all of the matches in a string.
 * @param string input
 */
function getAllMatches(input) {
  let match
  const results = []
  const regex = getRegExp()

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
    src = path.join(__dirname, src)
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
  getRegExp,
  getAllMatches,
  processFile,
  tauschen,
}
