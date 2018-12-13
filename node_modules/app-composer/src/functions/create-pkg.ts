import * as path from 'path';
import * as fs from 'fs';
import * as execa from 'execa';
import * as mkdirp from './folder-creator';
import { PackageJson } from '../types/package-json';
import { invokePackage } from './invoke-package';
import { transformToCompose } from './transform-to-compose';
import * as uuid from 'uuid';

type ObjMap = { [id: string]: string };
export interface CreatePkgOptions {
  replace: boolean;
  localDependencies: { [id: string]: string };
}

function addProjectPackages(pkgDeps: ObjMap, targetFolder: string, options: CreatePkgOptions): void {
  if (!options.localDependencies) {
    return;
  }

  Object.keys(options.localDependencies).forEach((dependencyName) => {
    if (pkgDeps && pkgDeps[dependencyName]) {
      const pathToProject = options.localDependencies[dependencyName];
      const packageJson = PackageJson.read(pathToProject);
      if (pack(packageJson.name, pathToProject, targetFolder, options)) {
        addProjectPackages(packageJson.dependencies, targetFolder, options);
      }
    }
  });
}

export function pack(pkgName: string, srcFolder: string, trgFolder: string, options: CreatePkgOptions): boolean {
  const composeDir = path.join(trgFolder, 'compose');
  const tmpDir = path.join(trgFolder, '.tmp', uuid.v4());
  const pkgFileName = path.join(composeDir, `${pkgName}`);
  const tmpFileName = path.join(tmpDir, `${pkgName}`);

  if (!options.replace && fs.existsSync(`${pkgFileName}.npm.tgz`)) {
    return false;
  }

  console.log(`creating ${pkgFileName}.npm.tgz`);

  mkdirp.sync(path.dirname(pkgFileName));
  mkdirp.sync(path.dirname(tmpFileName));

  execa.sync('yarn', ['pack', '-f', `${tmpFileName}.npm.tgz`, '--silent'], { cwd: srcFolder });
  fs.renameSync(`${tmpFileName}.npm.tgz`, `${pkgFileName}.npm.tgz`);
  return true;
}

export function createPkg(basePath: string = './', options?: CreatePkgOptions): void {
  const packageJson = PackageJson.read(basePath);
  if (!PackageJson.isComposable(packageJson)) {
    return;
  }

  options = options || { replace: false, localDependencies: {} };

  const appComposer = packageJson['app-composer'];
  const perCompose = transformToCompose(packageJson, appComposer);

  const composePaths: ObjMap = {};
  perCompose.forEach((entryPoints, composePath) => {
    composePath = path.resolve(basePath, composePath);
    const composeDir = path.join(composePath, 'compose');
    const pkgFname = path.join(composeDir, `${packageJson.name}`);

    pack(packageJson.name, basePath, composePath, options);
    addProjectPackages(packageJson.dependencies, composePath, options);

    composePaths[composePath] = composePath;

    const js = invokePackage(basePath, path.basename(pkgFname), entryPoints);
    PackageJson.writeDummy('app-composer', composePath, []);
    fs.writeFileSync(`${pkgFname}.Invocation.json`, JSON.stringify(js.invocation, null, 2));
  });
}
