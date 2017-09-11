import {getPackageJson, setPackageJson, setScript} from '../../helpers/package';
import {yarnInstallMissing} from '../../helpers/yarn';
import {
  LINT_STAGED_DEPENDENCIES,
  addLintStagedCommand
} from '../../helpers/lintStaged';

const PRETTIER_ARGS = '--single-quote --bracket-spacing=false';

export class PrettierPlugin {
  static flag = 'prettier';
  static description = 'Configures prettier and precommit hooks';

  async run() {
    await yarnInstallMissing(
      ['prettier'].concat(LINT_STAGED_DEPENDENCIES),
      true
    );

    const packageJson = getPackageJson();
    addLintStagedCommand(
      packageJson,
      'prettier',
      `prettier --write ${PRETTIER_ARGS}`
    );
    setScript(
      packageJson,
      'format',
      `prettier ${PRETTIER_ARGS} --write 'src/**/*.js'`
    );
    setScript(packageJson, 'precommit', 'lint-staged');
    setPackageJson(packageJson);
  }
}
