import {execSync} from 'child_process';
import spawn from 'cross-spawn';
import chalk from 'chalk';
import {stopWithError} from './basic';
import {getPackageJson, hasDependency} from './package';

export function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'});
    return true;
  } catch (e) {
    return false;
  }
}

export function yarnInstallMissing(
  dependencies,
  isDev = false,
  verbose = false
) {
  const packageJson = getPackageJson();
  const missingDeps = dependencies.filter(d => !hasDependency(packageJson, d));
  if (missingDeps.length > 0) {
    yarnInstall(missingDeps, isDev, verbose);
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
