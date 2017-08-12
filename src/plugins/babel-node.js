import {yarnInstall} from '../helpers/yarn';
import {
  getPackageJson,
  setScriptIfMissing,
  setPackageJson
} from '../helpers/package';

const DEPENDENCIES = [
  'babel-cli',
  'babel-preset-env',
  'babel-preset-stage-3',
  'babel-plugin-transform-class-properties'
];

export class BabelNodePlugin {
  static flag = 'babelnode';
  static description = 'Adds babel for a backend project';

  async run() {
    await yarnInstall(DEPENDENCIES, true);

    const pkg = getPackageJson();
    setScriptIfMissing(pkg, 'prebuild', 'rm -r build || true');
    setScriptIfMissing(pkg, 'build', 'babel src --copy-files --out-dir build');
    setPackageJson(pkg);

    // TODO set .babelrc
  }
}
