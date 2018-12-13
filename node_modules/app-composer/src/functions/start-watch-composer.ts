import * as path from 'path';
import * as chokidar from 'chokidar';
import { Watcher } from '../types/watcher';

export function startWatchComposer(baseDir: string = __dirname): void {
  const watchDir = path.join(baseDir, 'compose');
  const watcher = new Watcher(path.basename(baseDir), baseDir, watchDir);
  console.log(`composer starts in ${baseDir} watches: ${watchDir}`);
  const choki = chokidar.watch(watchDir, {
    ignoreInitial: true
  });
  choki.on('all', () => watcher.dog('watch'));
  choki.on('ready', () => watcher.dog('ready'));
}
