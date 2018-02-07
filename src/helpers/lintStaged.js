import _last from 'lodash/last'

export const LINT_STAGED_DEPENDENCIES = ['lint-staged', 'husky']

export function addLintStagedCommand(
  packageJson,
  check,
  command,
  atStart = true
) {
  if (!packageJson['lint-staged']) {
    packageJson['lint-staged'] = {}
  }

  if (!packageJson['lint-staged']['*.js']) {
    packageJson['lint-staged']['*.js'] = []
  }

  if (!(_last(packageJson['lint-staged']['*.js']) === 'git add')) {
    packageJson['lint-staged']['*.js'].push('git add')
  }

  if (!packageJson['lint-staged']['*.js'].some(c => c.indexOf(check) >= 0)) {
    if (atStart) {
      packageJson['lint-staged']['*.js'].unshift(command)
    } else {
      const nbCmd = packageJson['lint-staged']['*.js'].length
      packageJson['lint-staged']['*.js'].splice(nbCmd - 1, 0, command)
    }
  }
}
