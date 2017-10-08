import chalk from 'chalk';
import fs from 'fs-extra';
import readlineSync from 'readline-sync';

export function stopWithError(text) {
  console.log(chalk.red(text));
  process.exit(1);
}

export function copyFile(source, destination) {
  if (fs.existsSync(destination)) {
    console.log(
      chalk.yellow(`Destination file ${destination} already exists.`)
    );

    let value = askValue(
      'Do you want to replace it? (d to see the difference) [ydN]: ',
      ['y', 'yes', 'n', 'no', '', 'd']
    );

    if (value === 'd') {
      console.log(chalk.blue('- Current content'));
      console.log(fs.readFileSync(destination).toString());
      console.log(chalk.blue('- New content'));
      console.log(fs.readFileSync(source).toString());
      value = askValue('Do you want to replace it? [yN]: ', [
        'y',
        'yes',
        'n',
        'no',
        ''
      ]);
    }

    if (!['y', 'yes'].includes(value)) {
      console.log('Skipping file');
      return;
    }

    console.log('Replacing file');
  }
  fs.copySync(source, destination);
  console.log(chalk.blue(`Added file ${destination}`));
}

export function askValue(prompt, options) {
  //eslint-disable-next-line no-constant-condition
  while (true) {
    const value = readlineSync.question(chalk.yellow(prompt));
    if (options.includes(value.toLowerCase())) {
      return value.toLowerCase();
    }
  }
}
