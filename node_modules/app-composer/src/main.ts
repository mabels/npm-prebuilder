
import {
  PackageJson,
  startApp,
  createPkg,
  startWatchComposer
} from '../src/index';
import * as yargs from 'yargs';

// tslint:disable-next-line:no-unused-expression
yargs.usage('Usage: $0 <command> [options]')
  .command('watchComposer', 'start the watching Compose Server', {}, (argv) => {
    const cwd = PackageJson.findPathTo(process.cwd());
    console.log(`start the watching Compose Server in [${cwd}]`);
    startWatchComposer(cwd);  // refactoring
  })
  .command('server', 'start the Compose Server', {}, (argv) => {
    const cwd = PackageJson.findPathTo(process.cwd());
    console.log(`start the Compose Server in [${cwd}]`);
    startApp(cwd); // refactoring
  })
  .command('compose', 'start the composing process', {}, (argv) => {
    const cwd = PackageJson.findPathTo(process.cwd());
    console.log(`start the composing process in [${cwd}]`);
    createPkg(cwd); // refactoring
  })
  .argv;
