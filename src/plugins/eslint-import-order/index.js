import path from 'path'
import {copyFile} from '../../helpers/basic'
import {addLintStagedCommand} from '../../helpers/lintStaged'
import {getPackageJson, setPackageJson} from '../../helpers/package'
import {yarnInstallMissing} from '../../helpers/yarn'

export class EslintImportOrderPlugin {
  static flag = 'eslint-import'
  static description = 'Configures eslint to auto sort imports'

  async run() {
    await yarnInstallMissing(['eslint', 'eslint-plugin-import'], true)

    copyFile(
      path.join(__dirname, 'data', 'eslintrc.json'),
      './.eslintrc-import-order.json'
    )

    const packageJson = getPackageJson()
    addLintStagedCommand(
      packageJson,
      'import-order',
      'eslint --fix -c .eslintrc-import-order.json'
    )
    setPackageJson(packageJson)
  }
}
