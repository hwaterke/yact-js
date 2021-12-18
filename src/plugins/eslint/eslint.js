import path from 'path'
import {
  getPackageJson,
  hasDependency,
  setPackageJson,
} from '../../helpers/package'
import {yarnInstallMissing} from '../../helpers/yarn'
import {addLintStagedCommand} from '../../helpers/lintStaged'
import {copyFile} from '../../helpers/basic'

export class EslintPlugin {
  static flag = 'eslint'
  static description = 'Configures eslint and precommit hooks'

  async run() {
    const isCRA = hasDependency(getPackageJson(), 'react-scripts')
    const isRN = hasDependency(getPackageJson(), 'react-native')
    const isTypescript = hasDependency(getPackageJson(), 'typescript')

    // In a create-react-app environment we do not need to install eslint
    if (isCRA) {
      await yarnInstallMissing(
        ['lint-staged', 'husky', 'eslint-plugin-react'],
        true
      )
      copyFile(
        path.join(__dirname, 'data', 'eslintrc.react.json'),
        './.eslintrc.json'
      )
    } else if (isRN) {
      await yarnInstallMissing(
        [
          'lint-staged',
          'husky',
          'eslint',
          'babel-eslint',
          'eslint-plugin-import',
          'eslint-plugin-react',
        ],
        true
      )
      copyFile(
        path.join(__dirname, 'data', 'eslintrc.react-native.json'),
        './.eslintrc.json'
      )
    } else if (isTypescript) {
      await yarnInstallMissing(
        [
          '@typescript-eslint/parser',
          '@typescript-eslint/eslint-plugin',
          'eslint',
          'eslint-config-prettier',
          'eslint-plugin-import'
        ],
        true
      )



    } else {
      await yarnInstallMissing(
        [
          'lint-staged',
          'husky',
          'eslint',
          'babel-eslint',
          'eslint-plugin-import',
        ],
        true
      )
      copyFile(
        path.join(__dirname, 'data', 'eslintrc.node.json'),
        './.eslintrc.json'
      )
    }

    const packageJson = getPackageJson()
    addLintStagedCommand(
      packageJson,
      'eslint',
      'eslint --max-warnings 0',
      undefined,
      false
    )

    packageJson.husky = {
      hooks: {
        'pre-commit': 'lint-staged',
      },
    }

    setPackageJson(packageJson)
  }
}
