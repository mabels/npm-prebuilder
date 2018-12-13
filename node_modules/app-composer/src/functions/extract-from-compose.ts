
import { extractor } from './extractor';
import { filesToNames } from './files-to-names';
import { Names } from '../types/names';
import * as path from 'path';

// tslint:disable-next-line: no-var-requires no-require-imports
const globby = require('globby');

export function extractFromCompose(basePath: string, composePath: string, prevPkgs: string[]): Promise<Names[]> {
  return new Promise((rs, rj) => {
    const globCompose = `${composePath}/**/*`;
    // console.log(`yarnAddOrExtract:${globCompose}`);
    globby([globCompose]).then((files: string[]) => {
      // console.log(`yarnAddOrExtract:${globCompose}:${files}`);
      const names = filesToNames(files.sort());
      const extractedPath = path.join(composePath, '..', 'node_modules');
      extractor(extractedPath, Array.from(names.values())).then((nss) => {
        rs(nss);
      });
    });
  });
}
