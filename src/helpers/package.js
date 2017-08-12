import path from 'path';
import fs from 'fs-extra';
import {stopWithError} from './basic';

const PACKAGE = 'package.json';

function packageJsonPath() {
  return path.join(process.cwd(), PACKAGE);
}

export const hasPackageJson = () => {
  return fs.existsSync(packageJsonPath());
};

export const ensurePackageJson = () => {
  if (!hasPackageJson()) {
    stopWithError(`No ${PACKAGE} in current directory`);
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
  packageJson.scripts[name] = content;
}

export function setScriptIfMissing(packageJson, name, content) {
  if (getScript(packageJson, name) === undefined) {
    setScript(packageJson, name, content);
  }
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
