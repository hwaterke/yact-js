import {execSync} from 'child_process';
import spawn from 'cross-spawn';
import chalk from 'chalk';
import {stopWithError} from './basic';

export function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

export function yarnInstall(dependencies, isDev = false, verbose = false) {
  // Fail if yarn is not installed
  if (!shouldUseYarn()) {
    stopWithError('Yarn is not installed.');
  }

  return new Promise((resolve, reject) => {
    let command;
    let args;

    command = 'yarnpkg';
    args = ['add'];
    [].push.apply(args, dependencies);

    if (isDev) {
      args.push('--dev');
    }

    if (verbose) {
      args.push('--verbose');
    }

    console.log(chalk.yellow(`Installing ${dependencies.join(', ')}`));

    const child = spawn(command, args, {stdio: 'inherit'});
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`
        });
        return;
      }
      resolve();
    });
  });
}
