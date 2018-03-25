import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import {stopWithError, askValue} from './basic';
import {execSync} from 'child_process';

const PACKAGE = 'package.json';

function packageJsonPath() {
  return path.join(process.cwd(), PACKAGE);
}

export const hasPackageJson = () => {
  return fs.existsSync(packageJsonPath());
};

export const ensurePackageJson = () => {
  if (!hasPackageJson()) {
    console.log(chalk.red(`No ${PACKAGE} in current directory`));
    const value = askValue(
      chalk.yellow('Do you use to create one for you? [y/N]: '),
      ['y', 'n', 'yes', 'no', '']
    );
    if (['y', 'yes', ''].includes(value)) {
      console.log(
        'Creating an empty package.json file using ' +
          chalk.blue('yarn init -y')
      );
      execSync('yarn init -y');
    } else if (['n', 'no'].includes(value)) {
      stopWithError('Quitting');
      return;
    }
  }
};

export function getPackageJson() {
  return JSON.parse(fs.readFileSync(packageJsonPath()));
}

export function setPackageJson(content) {
  return fs.writeFileSync(packageJsonPath(), JSON.stringify(content, null, 2));
}

export function getScript(packageJson, name) {
  if (packageJson.scripts) {
    return packageJson.scripts[name];
  }
  return undefined;
}

export function setScript(packageJson, name, content) {
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  if (packageJson.scripts[name] && packageJson.scripts[name] != content) {
    console.log(chalk.yellow(`Script ${name} already contains:`));
    console.log(chalk.blue(` > ${packageJson.scripts[name]}`));
    console.log(chalk.yellow('instead of'));
    console.log(chalk.blue(` > ${content}`));
    const value = askValue(chalk.yellow('Do you want to replace it? [y/N]: '), [
      'y',
      'n',
      'yes',
      'no',
      ''
    ]);
    if (['y', 'yes'].includes(value)) {
      console.log('Replacing script');
    } else if (['', 'n', 'no'].includes(value)) {
      console.log('Skipping');
      return;
    }
  }

  packageJson.scripts[name] = content;
}

/**
 * Returns true if the dependency provided is installed
 */
export function hasDependency(packageJson, dependency) {
  return (
    (packageJson.dependencies && packageJson.dependencies[dependency]) ||
    (packageJson.devDependencies && packageJson.devDependencies[dependency])
  );
}
