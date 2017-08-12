#!/usr/bin/env node
import {PrettierModule} from './plugins/prettier';
import {BabelNodePlugin} from './plugins/babel-node';
import {ensurePackageJson} from './helpers/package';

async function perform() {
  await new BabelNodePlugin().run();
  await new PrettierModule().run();
  console.log('done');
}

ensurePackageJson();
perform();
