import path from 'path';
import {getPackageJson, setPackageJson, setScript} from '../../helpers/package';
import {yarnInstall} from '../../helpers/yarn';
import {copyFile} from '../../helpers/basic';

export class ReactRewiredBabelPlugin {
  static flag = 'rewirebabel';
  static description = 'Configures react rewired to allow decorators in create-react-app projects';

  async run() {
    await yarnInstall(
      ['react-app-rewired', 'babel-plugin-transform-decorators-legacy'],
      true
    );
    copyFile(
      path.join(__dirname, 'data', 'config-overrides.js'),
      './config-overrides.js'
    );
    const packageJson = getPackageJson();
    setScript(packageJson, 'start', 'react-app-rewired start');
    setScript(packageJson, 'test', 'react-app-rewired test --env=jsdom');
    setScript(packageJson, 'build', 'react-app-rewired build');
    setPackageJson(packageJson);
  }
}
