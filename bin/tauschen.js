const program = require('commander')
const chalk = require('chalk')
const packageJson = require('../package.json')
const tauschen = require('../src/lib.js').tauschen
const log = console.log

program
  .version(packageJson.version)

program
  .command('generate')
  .description('Generate translation files from teampltes')
  .option('-s --src <src>', 'src')
  .action((options) => {
    const matches = tauschen(options.src)

    if (matches === null) {
      log(chalk.red('Unable to generate files!'))
      return
    }

    log(chalk.green(JSON.stringify(matches, null, 2)))
  })

program.parse(process.argv)
