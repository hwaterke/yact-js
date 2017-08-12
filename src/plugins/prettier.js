import {
  getPackageJson,
  setPackageJson,
  hasDependency,
  setScriptIfMissing
} from '../helpers/package';
import {yarnInstall} from '../helpers/yarn';

const PRETTIER_ARGS = '--single-quote --bracket-spacing=false';

export class PrettierPlugin {
  static flag = 'prettier';
  static description = 'Configures prettier and precommit hooks';

  async run() {
    await yarnInstall(['prettier', 'lint-staged', 'husky'], true);

    // Update package.json
    const packageJson = getPackageJson();
    packageJson['lint-staged'] = {
      '*.js': [`prettier --write ${PRETTIER_ARGS}`, 'git add']
    };

    console.log('eslint?', hasDependency(packageJson, 'eslint'));

    if (hasDependency(packageJson, 'eslint')) {
      packageJson['lint-staged'] = {
        '*.js': [`prettier --write ${PRETTIER_ARGS}`, 'eslint', 'git add']
      };
    }

    setScriptIfMissing(
      packageJson,
      'format',
      `prettier ${PRETTIER_ARGS} --write 'src/**/*.js'`
    );
    setScriptIfMissing(packageJson, 'precommit', 'lint-staged');
    setPackageJson(packageJson);
  }
}
