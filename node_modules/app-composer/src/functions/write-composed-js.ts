import * as path from 'path';
import * as fs from 'fs';
import { Invocation } from '../types/invocation';
import { Names } from '../types/names';

export function writeComposedJs(pkgName: string, directory: string, names: Names[]): string {
  const composedJs = path.join(directory, 'index.js');
  const invocation = new Invocation(pkgName);
  names.filter((n) => !!n.invocationJson).map((n) => {
    invocation.merge(Invocation.fill(n.invocationJson));
  });
  fs.writeFileSync(composedJs, invocation.build(invocation.jsGlobalRequires));
  return composedJs;
}
