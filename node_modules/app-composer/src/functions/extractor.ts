import * as path from 'path';
import * as fs from 'fs';
import * as execa from 'execa';
import * as rimraf from 'rimraf';
import * as mkdirp from './folder-creator';
import { Names } from '../types/names';
import * as uuid from 'uuid';

export function extractor(extractedPath: string, names: Names[]): Promise<Names[]> {
  console.log('extracting packages...');
  const promiseNames = names.map((u) => new Promise<Names>((rs, rj) => {
    u.uuid = u.uuid || uuid.v4();
    const tmpDir = path.join(extractedPath, '.temp', u.uuid);
    // console.log(`mkdirp: ${tmpDir}`);
    mkdirp(tmpDir, undefined, (err) => {
      if (err) {
        rj(err);
        return;
      }
      execa('sh', ['-c', `cd ${tmpDir} && tar xzf ${u.npmPackage}`]).then(() => {
        const packageDir = path.join(tmpDir, 'package');
        u.packageJson = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json')).toString());
        const ijp = `${path.join(path.dirname(u.npmPackage), path.basename(u.npmPackage, '.npm.tgz'))}.Invocation.json`;
        try {
          u.invocationJson = JSON.parse(fs.readFileSync(ijp).toString());
        } catch (e) {
          // nothing todo
        }
        const pname = u.packageJson.name;
        const pkgDir = path.join(extractedPath, pname);
        // console.log(`remove to ${pkgDir}`);
        rimraf(pkgDir, (_err) => {
          if (_err) {
            rj(_err);
            return;
          }
          // console.log(`mkdir to ${path.dirname(pkgDir)}`);
          mkdirp(path.dirname(pkgDir), undefined, (_err2) => {
            if (_err2) {
              rj(_err2);
              return;
            }
            // console.log(`renamed:${packageDir}->${pkgDir}`);
            fs.rename(packageDir, pkgDir, () => {
              rimraf(tmpDir, (_err3) => {
                if (_err3) {
                  rj(_err3);
                  return;
                }
                rs(u);
              });
            });
          });
        });
      }).catch(rj);
    });
  }));
  return Promise.all<Names>(promiseNames);
  // const tarFname = pkgs[0];
  // execa('tar', ['xzf', tarFname,
  // const urls = pkgs
  //   .map((fname) => fname.substr(baseDir.length + '/'.length))
  //   .map((fname) => `file:./${fname}`);
  // console.log(`npx yarn add "${urls.join('" "')}"`);
  // const rexec = execa('npx', ['yarn', 'add'].concat(urls));
  // rexec.stdout.pipe(process.stdout);
  // rexec.stderr.pipe(process.stderr);
  // rexec.then(() => rs(pkgs)).catch(rj);
  // // Promise.all(pkgs.map((tarFname) => tar.x({
  // //     file: tarFname
  // //   })
  // // })).then();
}
