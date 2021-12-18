import path from 'path'
import {yarnInstallMissing} from '../../helpers/yarn'
import {copyFile} from '../../helpers/basic'
import {getPackageJson, setPackageJson, setScript} from '../../helpers/package'
import {addLintStagedCommand} from '../../helpers/lintStaged'

export class TslintPlugin {
  static flag = 'tslint'
  static description = 'Configures tslint for node project'

  async run() {
    await yarnInstallMissing(['tslint', 'tslint-config-prettier'], true)

    copyFile(path.join(__dirname, 'data', 'tslint.json'), './tslint.json')

    const packageJson = getPackageJson()
    addLintStagedCommand(packageJson, 'tslint', 'tslint --fix', '*.ts', false)

    setScript(
      packageJson,
      'lint',
      `tslint --config tslint.json --project tsconfig.json`
    )

    packageJson.husky = {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    }

    setPackageJson(packageJson)
  }
}
