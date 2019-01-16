import path from 'path'
import {yarnInstallMissing} from '../../helpers/yarn'
import {copyFile} from '../../helpers/basic'
import {getPackageJson, setPackageJson, setScript} from '../../helpers/package'

export class TypescriptNodePlugin {
  static flag = 'tsnode'
  static description = 'Configures typescript for node project'

  async run() {
    await yarnInstallMissing(
      ['typescript', '@types/node', 'nodemon', 'ts-node'],
      true
    )

    copyFile(path.join(__dirname, 'data', 'tsconfig.json'), './tsconfig.json')
    copyFile(path.join(__dirname, 'data', 'nodemon.json'), './nodemon.json')

    const packageJson = getPackageJson()
    packageJson.main = 'build/index.js'
    packageJson.types = 'build/index'

    setScript(packageJson, 'start', 'ts-node src/index.ts')
    setScript(packageJson, 'dev', 'nodemon')

    setScript(packageJson, 'prebuild', 'rm -r build || true')
    setScript(packageJson, 'build', 'tsc')

    setPackageJson(packageJson)
  }
}
