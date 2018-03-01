import path from 'path'
import {copyFile} from '../../helpers/basic'
import {getPackageJson, setPackageJson, setScript} from '../../helpers/package'
import {yarnInstallMissing} from '../../helpers/yarn'
import {
  LINT_STAGED_DEPENDENCIES,
  addLintStagedCommand,
} from '../../helpers/lintStaged'

export class PrettierPlugin {
  static flag = 'prettier'
  static description = 'Configures prettier and precommit hooks'

  async run() {
    await yarnInstallMissing(
      ['prettier'].concat(LINT_STAGED_DEPENDENCIES),
      true
    )

    copyFile(
      path.join(__dirname, 'data', 'prettierrc.json'),
      './.prettierrc.json'
    )

    const packageJson = getPackageJson()
    addLintStagedCommand(packageJson, 'prettier', `prettier --write`)
    addLintStagedCommand(
      packageJson,
      'prettier',
      `prettier --write`,
      '*.{css,scss,json,md}'
    )
    setScript(packageJson, 'format', `prettier --write 'src/**/*.js'`)
    setScript(packageJson, 'precommit', 'lint-staged')
    setPackageJson(packageJson)
  }
}
