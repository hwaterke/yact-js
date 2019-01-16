import path from 'path'
import {yarnInstallMissing} from '../../helpers/yarn'
import {getPackageJson, setPackageJson, setScript} from '../../helpers/package'
import {copyFile} from '../../helpers/basic'

export class TsjestPlugin {
  static flag = 'tsjest'
  static description = 'Configures ts-jest for node project'

  async run() {
    await yarnInstallMissing(['ts-jest', 'jest', '@types/jest'], true)

    copyFile(path.join(__dirname, 'data', 'jest.config.js'), './jest.config.js')

    const packageJson = getPackageJson()
    setScript(packageJson, 'test', 'jest')
    setScript(packageJson, 'coverage', 'jest --coverage')
    setPackageJson(packageJson)
  }
}
