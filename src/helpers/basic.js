import chalk from 'chalk'
import fs from 'fs-extra'
import readlineSync from 'readline-sync'

const error = chalk.red
const log = chalk.blue
const warning = chalk.yellow

export function stopWithError(text) {
  console.log(error(text))
  process.exit(1)
}

export function logToUser(text) {
  console.log(log(text))
}

export function copyFile(source, destination) {
  if (fs.existsSync(destination)) {
    console.log(warning(`Destination file ${destination} already exists.`))

    let value = askValue(
      'Do you want to replace it? (d to see the difference) [ydN]: ',
      ['y', 'yes', 'n', 'no', '', 'd']
    )

    if (value === 'd') {
      console.log(log('- Current content'))
      console.log(fs.readFileSync(destination).toString())
      console.log(log('- New content'))
      console.log(fs.readFileSync(source).toString())
      value = askValue('Do you want to replace it? [yN]: ', [
        'y',
        'yes',
        'n',
        'no',
        '',
      ])
    }

    if (!['y', 'yes'].includes(value)) {
      console.log('Skipping file')
      return
    }

    console.log('Replacing file')
  }
  fs.copySync(source, destination)
  console.log(log(`Added file ${destination}`))
}

export function askValue(prompt, options) {
  //eslint-disable-next-line no-constant-condition
  while (true) {
    const value = readlineSync.question(warning(prompt))
    if (options.includes(value.toLowerCase())) {
      return value.toLowerCase()
    }
  }
}
