#!/usr/bin/env node
import chalk from 'chalk'
import program from 'commander'
import {version} from '../package.json'
import {ensurePackageJson} from './helpers/package'
import {BabelNodePlugin} from './plugins/babel-node/babel-node'
import {DockerSPAPlugin} from './plugins/docker-spa/docker-spa'
import {EslintImportOrderPlugin} from './plugins/eslint-import-order'
import {EslintPlugin} from './plugins/eslint/eslint'
import {PrettierPlugin} from './plugins/prettier/prettier'
import {ReactRewiredBabelPlugin} from './plugins/react-rewired-babel/react-rewired-babel'

// Add new plugins here.
const PLUGINS = [
  BabelNodePlugin,
  PrettierPlugin,
  EslintPlugin,
  ReactRewiredBabelPlugin,
  DockerSPAPlugin,
  EslintImportOrderPlugin,
]

async function runPlugin(plugin) {
  console.log(chalk.blue(`Running ${plugin.name}`))
  const instance = new plugin()
  await instance.run()
  console.log(chalk.green(`${plugin.name}: done`))
}

// Commander
let configuredProgram = program.version(version)
PLUGINS.forEach(pl => {
  configuredProgram = configuredProgram.option(`--${pl.flag}`, pl.description)
})
configuredProgram.parse(process.argv)

ensurePackageJson()

// Run selected plugins
async function runAllPlugins() {
  for (let pl of PLUGINS) {
    if (program[pl.flag]) {
      await runPlugin(pl)
    }
  }
}

runAllPlugins()
