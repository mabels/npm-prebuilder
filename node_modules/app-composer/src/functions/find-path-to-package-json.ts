import * as fs from 'fs';
import * as path from 'path';

export function findPathOfPackageJson(str: string): string {
  if (str.length === 0) { return null; }
  const stat = fs.statSync(str);
  if (!stat) {
    throw new Error(`this must be somewhere ${str}`);
  }
  let pjson: string;
  let base: string;
  if (stat.isDirectory()) {
    base = str;
    pjson = path.join(base, 'package.json');
  } else {
    base = path.dirname(str);
    pjson = path.join(base, 'package.json');
  }
  const ret = fs.existsSync(pjson);
  if (!ret) {
    if (base != path.dirname(base)) {
      return findPathOfPackageJson(path.dirname(base));
    } else {
      return null;
    }
  }
  return base;
}
