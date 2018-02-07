import {execSync} from 'child_process'
import spawn from 'cross-spawn'
import chalk from 'chalk'
import {getPackageJson, hasDependency} from './package'

export function isYarnAvailable() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'})
    return true
  } catch (e) {
    return false
  }
}

export function yarnInstallMissing(
  dependencies,
  isDev = false,
  verbose = false
) {
  const packageJson = getPackageJson()
  const missingDeps = dependencies.filter(d => !hasDependency(packageJson, d))
  if (missingDeps.length > 0) {
    yarnInstall(missingDeps, isDev, verbose)
  }
}

export function yarnInstall(dependencies, isDev = false) {
  // Fail if yarn is not installed
  const withYarn = isYarnAvailable()

  return new Promise((resolve, reject) => {
    const command = withYarn ? 'yarnpkg' : 'npm'

    let args = [isDev ? '--save-dev' : '--save']
    if (withYarn) {
      args = ['add']
      if (isDev) {
        args.push('--dev')
      }
    }

    console.log(chalk.yellow(`Installing ${dependencies.join(', ')}`))

    const child = spawn(command, [...args, ...dependencies], {
      stdio: 'inherit',
    })

    child.on('close', code => {
      if (code !== 0) {
        reject('Error installing dependencies')
        return
      }
      resolve()
    })
  })
}
