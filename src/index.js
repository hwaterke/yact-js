import program from 'commander';
import {version} from '../package.json';

program.version(version);

program
  .usage('[option]')
  .option('-es, --eslint', 'Installs eslint')
  .option('-ls, --lintstaged', 'Installs lint-staged');

program.parse(process.argv);
