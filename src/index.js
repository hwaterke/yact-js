#!/usr/bin/env node
import program from 'commander';
import chalk from 'chalk';
import {ensurePackageJson} from './helpers/package';
import {PrettierPlugin} from './plugins/prettier/prettier';
import {BabelNodePlugin} from './plugins/babel-node/babel-node';
import {ReactRewiredBabelPlugin} from './plugins/react-rewired-babel/react-rewired-babel';
import {EslintPlugin} from './plugins/eslint/eslint';
import {DockerSPAPlugin} from './plugins/docker-spa/docker-spa';

// Add new plugins here.
const PLUGINS = [
  BabelNodePlugin,
  PrettierPlugin,
  EslintPlugin,
  ReactRewiredBabelPlugin,
  DockerSPAPlugin
];

async function runPlugin(plugin) {
  console.log(chalk.blue(`Running ${plugin.name}`));
  const instance = new plugin();
  await instance.run();
  console.log(chalk.green(`${plugin.name}: done`));
}

// Commander
let configuredProgram = program.version('0.0.1');
PLUGINS.forEach(pl => {
  configuredProgram = configuredProgram.option(`--${pl.flag}`, pl.description);
});
configuredProgram.parse(process.argv);

ensurePackageJson();

// Run selected plugins
async function runAllPlugins() {
  for (let pl of PLUGINS) {
    if (program[pl.flag]) {
      await runPlugin(pl);
    }
  }
}

runAllPlugins();
