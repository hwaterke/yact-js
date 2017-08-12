import chalk from 'chalk';

export function stopWithError(text) {
  console.log(chalk.red(text));
  process.exit(1);
}
