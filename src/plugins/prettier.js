import {
  getPackageJson,
  setPackageJson,
  hasDependency,
  setScriptIfMissing
} from '../helpers/package';
import {yarnInstall} from '../helpers/yarn';

export class PrettierModule {
  flag = 'prettier';

  description = 'Configures prettier and precommit hooks';

  PRETTIER_ARGS = '--single-quote --bracket-spacing=false';

  async run() {
    await yarnInstall(['prettier', 'lint-staged', 'husky'], true);

    // Update package.json
    const packageJson = getPackageJson();
    packageJson['lint-staged'] = {
      '*.js': [`prettier --write ${this.PRETTIER_ARGS}`, 'git add']
    };

    console.log('eslint?', hasDependency(packageJson, 'eslint'));

    if (hasDependency(packageJson, 'eslint')) {
      packageJson['lint-staged'] = {
        '*.js': [`prettier --write ${this.PRETTIER_ARGS}`, 'eslint', 'git add']
      };
    }

    setScriptIfMissing(
      packageJson,
      'format',
      `prettier ${this.PRETTIER_ARGS} --write 'src/**/*.js'`
    );
    setScriptIfMissing(packageJson, 'precommit', 'lint-staged');
    setPackageJson(packageJson);
  }
}
