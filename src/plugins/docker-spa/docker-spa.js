import path from 'path';
import fs from 'fs';
import {getPackageJson, setPackageJson, setScript} from '../../helpers/package';
import {copyFile, stopWithError, logToUser} from '../../helpers/basic';

const DOCKERFILE = path.join(__dirname, 'data', 'Dockerfile');
const NGINX_SPA = path.join(__dirname, 'data', 'nginx-spa.conf');

export class DockerSPAPlugin {
  static flag = 'dockerspa';
  static description = 'Configures a docker production build for Single Page App';

  async run() {
    if (fs.existsSync('Dockerfile')) {
      return stopWithError(
        'Looks like your project is already set up for docker'
      );
    }
    copyFile(DOCKERFILE, 'Dockerfile');
    copyFile(NGINX_SPA, 'nginx-spa.conf');
    const pckg = getPackageJson();
    const {author, name} = pckg;
    setScript(
      pckg,
      'build:docker',
      `docker build -t ${author ? `@${author}/${name}` : name} .`
    );
    setPackageJson(pckg);
    logToUser('You can now run yarn run build:docker to build your SPA');
    logToUser(
      'change the name of the dockerbuild by editing the build:docker script'
    );
  }
}
