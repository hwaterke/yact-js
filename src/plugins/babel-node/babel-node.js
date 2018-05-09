import fs from 'fs-extra'
import path from 'path'
import {copyFile} from '../../helpers/basic'
import {getPackageJson, setPackageJson, setScript} from '../../helpers/package'
import {yarnInstallMissing} from '../../helpers/yarn'

const DEPENDENCIES = [
  '@babel/cli',
  '@babel/core',
  '@babel/preset-env',
  '@babel/preset-stage-3',
  '@babel/plugin-proposal-class-properties',
]

const GITIGNORE = '.gitignore'
const SRC_DIRECTORY = 'src'

export class BabelNodePlugin {
  static flag = 'babelnode'
  static description = 'Adds babel for a backend project'

  async run() {
    await yarnInstallMissing(DEPENDENCIES, true)

    const pkg = getPackageJson()
    setScript(pkg, 'prebuild', 'rm -r build || true')
    setScript(pkg, 'build', 'babel src --copy-files --out-dir build')
    setPackageJson(pkg)

    copyFile(path.join(__dirname, 'data', 'babelrc.json'), './.babelrc')

    // Check if build/ is in .gitignore
    if (fs.existsSync(GITIGNORE)) {
      const gitignore = fs
        .readFileSync(GITIGNORE)
        .toString()
        .split('\n')
      if (!gitignore.includes('build/')) {
        fs.appendFileSync(GITIGNORE, 'build/')
      }
    }

    // Check if src/index.js is present
    if (!fs.existsSync(SRC_DIRECTORY)) {
      fs.mkdirSync(SRC_DIRECTORY)
      fs.writeFileSync(
        path.join(SRC_DIRECTORY, 'index.js'),
        "console.log('Hello, world!');"
      )
    }
  }
}
