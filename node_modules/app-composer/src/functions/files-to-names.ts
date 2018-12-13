import { Names } from '../types/names';
import { Suffixes } from '../types/suffixes';
import * as uuid from 'uuid';

export function filesToNames(files: string[]): Map<string, Names> {
  const pkgs = new Map<string, string[]>();
  const suffixs = new Suffixes({
    package: 'suffixes',
    invocationJson: '.Invocation.json',
    npmPackage: '.npm.tgz'
  });
  files.forEach((fname) => {
    suffixs.values.forEach((suffix) => {
      if (!fname.endsWith(suffix)) {
        return;
      }
      const base = fname.slice(0, -suffix.length);
      const append = (pkgs.get(base) || []);
      append.push(fname);
      pkgs.set(base, append);
    });
  });
  Array.from(pkgs.entries()).forEach((e) => {
    if (e[1].length !== suffixs.values.length) {
      pkgs.delete(e[0]);
    }
  });
  const ret = new Map<string, Names>();
  pkgs.forEach((v, k) => {
    ret.set(k, {
      package: k,
      invocationJson: v.find((i) => i.endsWith(suffixs.names.invocationJson)),
      npmPackage: v.find((i) => i.endsWith(suffixs.names.npmPackage)),
      uuid: uuid.v4(),
    });
  });
  // console.log(`filesToNames:${JSON.stringify(Array.from(ret.values()))}`);
  return ret;
}
