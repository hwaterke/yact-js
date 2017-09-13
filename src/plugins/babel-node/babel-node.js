import fs from 'fs-extra';
import path from 'path';
import {yarnInstallMissing} from '../../helpers/yarn';
import {getPackageJson, setPackageJson, setScript} from '../../helpers/package';
import {copyFile} from '../../helpers/basic';

const DEPENDENCIES = [
  'babel-cli',
  'babel-preset-env',
  'babel-preset-stage-3',
  'babel-plugin-transform-class-properties'
];

const GITIGNORE = '.gitignore';

export class BabelNodePlugin {
  static flag = 'babelnode';
  static description = 'Adds babel for a backend project';

  async run() {
    await yarnInstallMissing(DEPENDENCIES, true);

    const pkg = getPackageJson();
    setScript(pkg, 'prebuild', 'rm -r build || true');
    setScript(pkg, 'build', 'babel src --copy-files --out-dir build');
    setPackageJson(pkg);

    copyFile(path.join(__dirname, 'data', 'babelrc'), './.babelrc');

    // Check if build/ is in .gitignore
    if (fs.existsSync(GITIGNORE)) {
      const gitignore = fs
        .readFileSync(GITIGNORE)
        .toString()
        .split('\n');
      if (!gitignore.includes('build/')) {
        fs.appendFileSync(GITIGNORE, 'build/');
      }
    }
  }
}
