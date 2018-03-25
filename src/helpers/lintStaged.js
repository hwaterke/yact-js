import _last from 'lodash/last'

export const LINT_STAGED_DEPENDENCIES = ['lint-staged', 'husky']

export function addLintStagedCommand(
  packageJson,
  check,
  command,
  fileGlob = '*.js',
  atStart = true
) {
  if (!packageJson['lint-staged']) {
    packageJson['lint-staged'] = {}
  }

  if (!packageJson['lint-staged'][fileGlob]) {
    packageJson['lint-staged'][fileGlob] = []
  }

  if (!(_last(packageJson['lint-staged'][fileGlob]) === 'git add')) {
    packageJson['lint-staged'][fileGlob].push('git add')
  }

  if (!packageJson['lint-staged'][fileGlob].some(c => c.indexOf(check) >= 0)) {
    if (atStart) {
      packageJson['lint-staged'][fileGlob].unshift(command)
    } else {
      const nbCmd = packageJson['lint-staged'][fileGlob].length
      packageJson['lint-staged'][fileGlob].splice(nbCmd - 1, 0, command)
    }
  }
}
